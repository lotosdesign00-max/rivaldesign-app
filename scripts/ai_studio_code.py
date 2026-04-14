import argparse
import mimetypes
import os
from pathlib import Path

from google import genai
from google.genai import errors
from google.genai import types


ROOT_DIR = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT_DIR = ROOT_DIR / "public" / "generated" / "gemini"


def load_env_file():
    env_path = ROOT_DIR / ".env"
    if not env_path.exists():
        return

    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and value and key not in os.environ:
            os.environ[key] = value


def get_api_key():
    load_env_file()
    return (
        os.environ.get("GEMINI_API_KEY")
        or os.environ.get("VITE_GEMINI_API_KEY")
        or os.environ.get("GOOGLE_API_KEY")
    )


def save_binary_file(file_name, data):
    with open(file_name, "wb") as f:
        f.write(data)
    print(f"File saved to: {file_name}")


def build_parser():
    parser = argparse.ArgumentParser(
        description="Generate images with Google AI Studio Gemini image model."
    )
    parser.add_argument(
        "--prompt",
        required=True,
        help="Prompt for image generation.",
    )
    parser.add_argument(
        "--model",
        default="gemini-2.5-flash-image",
        help="Gemini image model id.",
    )
    parser.add_argument(
        "--output-dir",
        default=str(DEFAULT_OUTPUT_DIR),
        help="Directory where generated images will be saved.",
    )
    parser.add_argument(
        "--file-prefix",
        default="gemini_image",
        help="Prefix for generated files.",
    )
    return parser


def generate(prompt, model, output_dir, file_prefix):
    api_key = get_api_key()
    if not api_key:
        raise RuntimeError(
            "GEMINI_API_KEY not found. Set GEMINI_API_KEY or VITE_GEMINI_API_KEY in environment or .env."
        )

    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    client = genai.Client(api_key=api_key)

    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=prompt),
            ],
        ),
    ]

    config = types.GenerateContentConfig(
        response_modalities=["IMAGE", "TEXT"],
    )

    file_index = 0
    try:
        for chunk in client.models.generate_content_stream(
            model=model,
            contents=contents,
            config=config,
        ):
            if chunk.parts is None:
                continue

            first_part = chunk.parts[0]
            inline_data = getattr(first_part, "inline_data", None)
            if inline_data and inline_data.data:
                file_extension = mimetypes.guess_extension(inline_data.mime_type) or ".bin"
                file_name = output_path / f"{file_prefix}_{file_index}{file_extension}"
                file_index += 1
                save_binary_file(file_name, inline_data.data)
            else:
                text = getattr(chunk, "text", "")
                if text:
                    print(text)
    except errors.ClientError as exc:
        message = str(exc)
        if "RESOURCE_EXHAUSTED" in message or "Quota exceeded" in message:
            raise RuntimeError(
                "Google Gemini image quota is exhausted for this project. Check billing/quota in Google AI Studio or Google Cloud."
            ) from exc
        raise

    if file_index == 0:
        print("No image bytes returned.")


def main():
    parser = build_parser()
    args = parser.parse_args()
    try:
        generate(
            prompt=args.prompt,
            model=args.model,
            output_dir=args.output_dir,
            file_prefix=args.file_prefix,
        )
    except Exception as exc:
        print(f"Error: {exc}")
        raise SystemExit(1)


if __name__ == "__main__":
    main()
