import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import SystemIcon from "./SystemIcon";
import { isMobilePerfMode, runAfterTap } from "../utils/performance";

const WATCH_TO_COMPLETE_SECONDS = 8;
function getOptimizedSrcSet(src) {
  if (typeof src !== "string" || !src.startsWith("/images/optimized/") || !src.endsWith(".jpg")) return undefined;
  return `${src.replace(/\.jpg$/, "-450.jpg")} 450w, ${src} 900w`;
}

function getCopy(lang) {
  const isEn = lang === "en";

  return {
    classroomTitle: isEn ? "Classroom" : "Классрум",
    classroomSub: isEn ? "Structured lessons, visual modules and clean progress." : "Структурные уроки, визуальные модули и понятный прогресс.",
    lessonsTitle: isEn ? "Course modules" : "Модули курса",
    backToCourses: isEn ? "Back to courses" : "К курсам",
    videoLesson: isEn ? "Video module" : "Видео-модуль",
    openLesson: isEn ? "Open lesson" : "Открыть урок",
    finishLesson: isEn ? "Complete lesson" : "Завершить урок",
    completed: isEn ? "Completed" : "Пройдено",
    inProgress: isEn ? "Watch a bit more" : "Посмотри еще немного",
    previewLabel: isEn ? "Lesson video" : "Видео урока",
    lessonHint: isEn ? "XP is granted only once per fully completed lesson." : "XP начисляется только один раз за полностью завершенный урок.",
    lessonDoneToast: isEn ? "+15 XP for lesson completion" : "+15 XP за завершение урока",
    alreadyDoneToast: isEn ? "This lesson is already completed" : "Этот урок уже пройден",
    markAsDone: isEn ? "Mark as completed" : "Отметить пройденным",
    courseDoneToast: isEn ? "Course completed!" : "Курс пройден!",
    moduleLabel: isEn ? "Module" : "Модуль",
    moduleStatusReady: isEn ? "Ready" : "Готов",
    moduleStatusDone: isEn ? "Done" : "Готово",
    moduleStatusNew: isEn ? "New lesson" : "Новый урок",
    progressShort: isEn ? "progress" : "прогресс",
    students: isEn ? "students" : "учеников",
    orderFullAccess: isEn ? "Order full access" : "Заказать полный доступ",
    resultTitle: isEn ? "Result" : "Результат",
    resultGreat: isEn ? "Excellent!" : "Отлично!",
    resultGood: isEn ? "Good job!" : "Хорошо!",
    resultLearn: isEn ? "Keep learning!" : "Учись дальше!",
    doneBtn: isEn ? "Done" : "Готово",
    questionLabel: isEn ? "Question" : "Вопрос",
    resumeLesson: isEn ? "Continue lesson" : "Продолжить урок",
    quizDoneTitle: isEn ? "Quiz completed" : "Викторина пройдена",
    quizReturnTomorrow: isEn ? "Come back tomorrow" : "Возвращайся завтра",
    quizDailyHint: isEn ? "questions · XP for every answer" : "вопросов · XP за каждый ответ",
    dailyQuizDone: isEn ? "Quiz already completed" : "Викторина уже пройдена",
    quizDoneSub: isEn ? "Come back tomorrow for the next round." : "Возвращайся завтра за следующим заходом.",
    videoMissingTitle: isEn ? "Video not added yet" : "Видео еще не добавлено",
    videoMissingText: isEn ? "Add your own lesson file to the local course folder and it will appear here." : "Добавь свой файл урока в локальную папку курса, и он сразу появится здесь.",
    lessonProgress: isEn ? "Lesson progress" : "Прогресс урока",
    premiumLockedTitle: isEn ? "Premium access required" : "Нужен премиум-доступ",
    premiumLockedText: isEn ? "This course preview is open, but lessons unlock only after purchase." : "Превью курса открыто, но уроки становятся доступны только после покупки.",
    premiumModulesText: isEn ? "Modules are locked until full access is unlocked." : "Модули заблокированы, пока не открыт полный доступ.",
    premiumOrderHint: isEn ? "After payment, this classroom can be unlocked for your account." : "После оплаты этот classroom можно открыть для твоего аккаунта.",
    orderCourse: isEn ? "Order this course" : "Заказать этот курс",
    lockedCourse: isEn ? "Locked course" : "Закрытый курс",
    freeCourse: isEn ? "Free course" : "Бесплатный курс",
    openPreview: isEn ? "Open preview" : "Открыть превью",
  };
}

function slugifyVideoPart(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}

function buildLessonVideoSrc(course, idx) {
  if (Array.isArray(course.lessonVideos) && course.lessonVideos[idx]) return course.lessonVideos[idx];
  if (course.videoBasePath) return `${course.videoBasePath.replace(/\/$/, "")}/lesson-${idx + 1}.mp4`;
  return `/videos/courses/${slugifyVideoPart(course.id || course.title || "course")}/lesson-${idx + 1}.mp4`;
}

function formatVideoTime(value) {
  const total = Math.max(0, Math.floor(value || 0));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function LessonModal({ th, lang, activeLesson, canComplete, onClose, onStart, onFinish, onPlaybackEnded, onSaveTime, onClearSavedTime, isDone }) {
  if (!activeLesson) return null;

  const copy = getCopy(lang);
  const { course, topic, idx } = activeLesson;
  const videoSrc = buildLessonVideoSrc(course, idx);
  const videoRef = useRef(null);
  const shellRef = useRef(null);
  const [videoMissing, setVideoMissing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [furthestTime, setFurthestTime] = useState(0);
  const lastSavedRef = useRef(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  const handleClose = () => {
    onSaveTime(currentTime);
    onClose();
  };

  const startTracking = () => {
    if (!activeLesson.watchStarted) onStart();
    setIsPlaying(true);
  };

  const pauseTracking = () => {
    setIsPlaying(false);
  };

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const handleSeek = (event) => {
    const next = Number(event.target.value || 0);
    if (videoRef.current) videoRef.current.currentTime = next;
    setCurrentTime(next);
  };

  const toggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  return createPortal(
    <div
      onClick={handleClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9200,
        background: "rgba(4, 6, 12, .82)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        animation: "fadeIn .22s ease",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: isExpanded ? "min(860px, calc(100vw - 20px))" : "min(680px, calc(100vw - 36px))",
          maxWidth: isExpanded ? "calc(100vw - 20px)" : "calc(100vw - 36px)",
          maxHeight: isExpanded ? "calc(100vh - 20px)" : "calc(100vh - 56px)",
          borderRadius: 28,
          border: `1px solid ${th.border}`,
          background: `linear-gradient(180deg, ${th.nav} 0%, ${th.card} 100%)`,
          boxShadow: `0 24px 64px rgba(0,0,0,.22)`,
          overflow: "hidden",
          animation: "cardIn .28s ease both",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: 18 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, color: th.accent, fontWeight: 900, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 6 }}>
              {copy.moduleLabel} {idx + 1}
            </div>
            <div style={{ fontSize: 21, fontWeight: 900, color: th.text, lineHeight: 1.22, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{topic}</div>
          </div>
          <button onClick={handleClose} style={{ width: 40, height: 40, borderRadius: 14, border: `1px solid ${th.border}`, background: th.card, color: th.sub, cursor: "pointer", fontSize: 18, flexShrink: 0 }}>×</button>
        </div>

        <div style={{ padding: "0 18px 18px" }}>
          <div ref={shellRef} style={{ overflow: "hidden", borderRadius: 24, border: `1px solid ${th.border}`, background: "#050607" }}>
            {!videoMissing ? (
              <>
                <div style={{ position: "relative", width: "100%", maxHeight: isExpanded ? "min(58vh, 420px)" : "min(42vh, 300px)", background: "#050607", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <video
                    ref={videoRef}
                    src={videoSrc}
                    poster={course.img}
                    playsInline
                    preload="metadata"
                    disablePictureInPicture
                    controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
                    onContextMenu={(e) => e.preventDefault()}
                    onPlay={startTracking}
                    onPause={() => {
                      pauseTracking();
                      onSaveTime(videoRef.current?.currentTime || currentTime);
                    }}
                    onLoadedMetadata={() => {
                      setDuration(videoRef.current?.duration || 0);
                      const resumeTime = Math.min(activeLesson.resumeTime || 0, Math.max((videoRef.current?.duration || 0) - 1, 0));
                      if (resumeTime > 0 && videoRef.current) videoRef.current.currentTime = resumeTime;
                      setCurrentTime(resumeTime);
                      setFurthestTime(resumeTime);
                      lastSavedRef.current = resumeTime;
                    }}
                    onTimeUpdate={() => {
                      const nextTime = videoRef.current?.currentTime || 0;
                      setCurrentTime(nextTime);
                      setFurthestTime((prev) => Math.max(prev, nextTime));
                      if (Math.abs(nextTime - lastSavedRef.current) >= 2) {
                        lastSavedRef.current = nextTime;
                        onSaveTime(nextTime);
                      }
                    }}
                    onEnded={() => {
                      setIsPlaying(false);
                      setCurrentTime(videoRef.current?.duration || duration || 0);
                      setFurthestTime(videoRef.current?.duration || duration || 0);
                      onClearSavedTime();
                      onPlaybackEnded();
                    }}
                    onError={() => setVideoMissing(true)}
                    style={{ width: "100%", maxHeight: isExpanded ? "min(58vh, 420px)" : "min(42vh, 300px)", display: "block", objectFit: "contain", background: "#050607" }}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10, padding: 14, borderTop: "1px solid rgba(255,255,255,.08)", background: "linear-gradient(180deg, rgba(255,255,255,.02), rgba(255,255,255,.01))", flexWrap: "wrap" }}>
                  <button onClick={togglePlayback} aria-label={isPlaying ? "Пауза" : "Пуск"} style={{ minWidth: 92, height: 42, borderRadius: 14, border: `1px solid ${th.border}`, background: th.card, color: th.text, fontSize: 18, fontWeight: 800, cursor: "pointer" }}>
                    <SystemIcon name={isPlaying ? "pause" : "play"} size={16} color={th.text} animated />
                  </button>

                  <div style={{ flex: 1, minWidth: 180, display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 11, color: th.sub, fontWeight: 800, minWidth: 34 }}>{formatVideoTime(currentTime)}</span>
                    <div style={{ flex: 1, display: "flex", alignItems: "center", height: 42 }}>
                      <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        step="0.1"
                        value={Math.min(currentTime, duration || 0)}
                        onChange={handleSeek}
                        style={{
                          width: "100%",
                          height: 6,
                          margin: 0,
                          borderRadius: 999,
                          outline: "none",
                          cursor: "pointer",
                          appearance: "none",
                          WebkitAppearance: "none",
                          background: `linear-gradient(90deg, ${th.accent} 0%, ${th.accent} ${duration ? (currentTime / duration) * 100 : 0}%, ${th.border} ${duration ? (currentTime / duration) * 100 : 0}%, ${th.border} 100%)`,
                          boxShadow: `inset 0 0 0 1px ${th.border}`,
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 11, color: th.sub, fontWeight: 800, minWidth: 34, textAlign: "right" }}>{formatVideoTime(duration)}</span>
                  </div>

                  <select value={playbackRate} onChange={(e) => setPlaybackRate(Number(e.target.value))} style={{ height: 42, borderRadius: 14, border: `1px solid ${th.border}`, background: th.card, color: th.text, padding: "0 12px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    <option value={0.75}>0.75x</option>
                    <option value={1}>1x</option>
                    <option value={1.25}>1.25x</option>
                    <option value={1.5}>1.5x</option>
                    <option value={2}>2x</option>
                  </select>

                  <button onClick={toggleExpanded} style={{ height: 42, borderRadius: 14, border: `1px solid ${th.border}`, background: th.card, color: th.text, padding: "0 14px", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
                    {isExpanded ? "Свернуть" : "Развернуть"}
                  </button>
                </div>
              </>
            ) : (
              <div style={{ aspectRatio: "16 / 9", display: "flex", alignItems: "center", justifyContent: "center", padding: 28, background: "radial-gradient(circle at 50% 20%, rgba(255,255,255,.06), transparent 32%), linear-gradient(180deg, rgba(8,8,10,.92) 0%, rgba(8,8,10,.98) 100%)" }}>
                <div style={{ width: "min(420px, 100%)", textAlign: "center" }}>
                  <div style={{ width: 68, height: 68, borderRadius: 999, margin: "0 auto 16px", background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.12)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><SystemIcon name="play" size={28} color="#fff" animated /></div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 8 }}>{copy.videoMissingTitle}</div>
                  <div style={{ fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,.72)" }}>{copy.videoMissingText}</div>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, flexWrap: "wrap", paddingTop: 16 }}>
            <button
              onClick={onFinish}
              disabled={isDone || videoMissing}
              style={{
                minWidth: 220,
                background: isDone ? th.surface : canComplete ? th.grad : th.card,
                color: isDone ? th.sub : canComplete ? th.btnTxt : th.text,
                border: isDone ? "none" : canComplete ? "none" : `1px solid ${th.border}`,
                borderRadius: 18,
                padding: "14px 18px",
                fontSize: 14,
                fontWeight: 900,
                cursor: !isDone && !videoMissing ? "pointer" : "default",
                boxShadow: canComplete && !isDone ? th.shadow : "none",
              }}
            >
              {isDone ? (<span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><SystemIcon name="check" size={14} color={th.sub} animated /> {copy.completed}</span>) : canComplete ? `+15 XP · ${copy.finishLesson}` : copy.markAsDone}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

function ModuleCard({ th, lang, course, topic, idx, done, progress, onOpen, locked }) {
  const copy = getCopy(lang);
  const [hovered, setHovered] = useState(false);
  const isMobilePerf = isMobilePerfMode();
  const effectiveHovered = !isMobilePerf && hovered;

  return (
    <button
      onClick={locked ? undefined : () => runAfterTap(onOpen)}
      onMouseEnter={() => !isMobilePerf && setHovered(true)}
      onMouseLeave={() => !isMobilePerf && setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        overflow: "hidden",
        borderRadius: 24,
        border: `1px solid ${locked ? "rgba(99,102,241,0.1)" : done ? "rgba(16,185,129,0.3)" : effectiveHovered ? "rgba(99,102,241,0.3)" : "rgba(99,102,241,0.15)"}`,
        background: `linear-gradient(180deg, ${th.card} 0%, rgba(8,9,20,1) 100%)`,
        cursor: locked ? "not-allowed" : "pointer",
        boxShadow: effectiveHovered
          ? "0 16px 40px rgba(3,4,8,0.5), inset 0 1px 0 rgba(255,255,255,0.06)"
          : "0 8px 24px rgba(3,4,8,0.3), inset 0 1px 0 rgba(255,255,255,0.02)",
        textAlign: "left",
        transition: isMobilePerf ? "border-color .16s ease, opacity .16s ease" : "border-color .3s cubic-bezier(.34,1.56,.64,1), box-shadow .3s cubic-bezier(.34,1.56,.64,1), transform .3s cubic-bezier(.34,1.56,.64,1), opacity .2s ease",
        transform: effectiveHovered && !locked ? "translateY(-4px)" : "translateY(0)",
        opacity: locked ? 0.8 : 1,
      }}
    >
      <div style={{ position: "relative", height: 160, overflow: "hidden", background: "#06070a", borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
        <img
          src={course.img}
          srcSet={getOptimizedSrcSet(course.img)}
          sizes="(max-width: 520px) 100vw, 420px"
          alt={topic}
          loading="lazy"
          decoding="async"
          style={{
            position: "absolute", inset: 0, width: "100%", height: "100%",
            objectFit: "cover", opacity: 0.18, filter: "grayscale(1) contrast(1.2)",
            transition: "transform 1.2s ease, opacity .4s ease",
            transform: effectiveHovered ? "scale(1.08)" : "scale(1)"
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,8,10,.6) 0%, rgba(8,8,10,.95) 100%)" }} />
        {locked && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(5,6,12,.5)", backdropFilter: "blur(2px)", zIndex: 1 }} />
        )}
        <div style={{ position: "relative", zIndex: 1, height: "100%", padding: 16, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)", fontWeight: 800, letterSpacing: ".1em", textTransform: "uppercase" }}>{copy.moduleLabel} {idx + 1}</div>
            <div style={{
              padding: "4px 10px", borderRadius: 999,
              background: locked ? "rgba(255,255,255,.05)" : done ? "rgba(16,185,129,.15)" : progress > 0 ? "rgba(99,102,241,.15)" : "rgba(255,255,255,.05)",
              border: locked ? "1px solid rgba(255,255,255,.1)" : done ? "1px solid rgba(16,185,129,.3)" : progress > 0 ? `1px solid rgba(99,102,241,.3)` : "1px solid rgba(255,255,255,.08)",
              color: locked ? "rgba(255,255,255,.6)" : done ? "#34d399" : progress > 0 ? "#818cf8" : "rgba(255,255,255,.6)",
              fontSize: 9.5, fontWeight: 900, whiteSpace: "nowrap"
            }}>
              {locked ? <SystemIcon name="lock" size={12} color="rgba(255,255,255,.6)" /> : done ? copy.moduleStatusDone : progress > 0 ? copy.moduleStatusReady : copy.moduleStatusNew}
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "8px" }}>
            <div style={{ fontSize: 22, lineHeight: 1.15, fontWeight: 900, color: "rgba(255,255,255,.95)", letterSpacing: "-.02em" }}>{topic}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
            <div style={{ fontSize: 11, color: "rgba(165,180,252,.7)", fontWeight: 700 }}>{course.title}</div>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: locked ? "rgba(255,255,255,.05)" : "rgba(99,102,241,.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, color: locked ? "rgba(255,255,255,.5)" : "#fff",
              transition: "transform .2s ease",
              transform: effectiveHovered ? "scale(1.15)" : "scale(1)"
            }}>
              {locked ? <SystemIcon name="lock" size={12} color="rgba(255,255,255,.5)" /> : <SystemIcon name="play" size={12} color="#fff" animated />}
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: "18px 20px" }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: "rgba(224,231,255,.95)", lineHeight: 1.25, marginBottom: 8, letterSpacing: "-.01em" }}>{topic}</div>
        <div style={{ fontSize: 12, color: "rgba(100,116,139,.8)", lineHeight: 1.5 }}>{locked ? copy.premiumModulesText : copy.videoLesson}</div>
      </div>
    </button>
  );
}
export default function CoursesTab({ th, t, lang, showToast, addXPfn, onUnlockAchieve, streak, setStreak }) {
  const g = (typeof window !== "undefined" && window.__RIVAL_GLOBALS) || {};
  const { LANGS, SFX, openTg, ls, COURSES_DATA, QUIZ_DATA } = g;

  const copy = getCopy(lang);
  const safeLs = ls || { get: (_k, d) => d, set: () => {} };
  const safeCoursesData = COURSES_DATA || { ru: [], en: [] };
  const safeQuizData = QUIZ_DATA || [];
  const safeLangs = LANGS || { ru: { rate: 1, cur: "$" } };
  const safeStreak = streak || { lastQuizDate: "", totalQuizCorrect: 0 };
  const isMobilePerf = isMobilePerfMode();
  const courses = safeCoursesData[lang] || safeCoursesData.ru || [];
  const rateInfo = safeLangs[lang] || safeLangs.ru || { rate: 1, cur: "$" };
  const cats = useMemo(() => ["all", ...new Set(courses.map((course) => course.cat))], [courses]);
  const today = new Date().toISOString().split("T")[0];

  const [cat, setCat] = useState("all");
  const [selCourse, setSelCourse] = useState(null);
  const [progress, setProgress] = useState(() => safeLs.get("rs_course_prog4", {}));
  const [lessonProgress, setLessonProgress] = useState(() => safeLs.get("rs_course_lesson_progress4", {}));
  const [videoPositions, setVideoPositions] = useState(() => safeLs.get("rs_course_video_pos4", {}));
  const [courseAccess, setCourseAccess] = useState(() => safeLs.get("rs_course_access4", {}));
  const [quizMode, setQuizMode] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizDone, setQuizDone] = useState(false);
  const [quizStart, setQuizStart] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [canCompleteLesson, setCanCompleteLesson] = useState(false);

  const filtered = useMemo(() => courses.filter((course) => cat === "all" || course.cat === cat), [courses, cat]);
  const quizQ = safeQuizData[quizIdx];
  const fmt = (usd) => (usd === 0 ? t.courseFree : `${Math.round(usd * rateInfo.rate)} ${rateInfo.cur}`);
  const hasCourseAccess = (course) => !!(course?.free || courseAccess?.[course.id]);
  useEffect(() => {
    const pendingCourseId = safeLs.get("rs_pending_course_open4", null);
    if (!pendingCourseId) return;
    const targetCourse = courses.find((course) => course.id === pendingCourseId);
    if (!targetCourse) return;
    setSelCourse(targetCourse);
    setCourseAccess((prev) => {
      if (prev?.[pendingCourseId]) return prev;
      const next = { ...(prev || {}), [pendingCourseId]: true };
      safeLs.set("rs_course_access4", next);
      return next;
    });
    safeLs.set("rs_pending_course_open4", null);
  }, [courses]);



  const getSavedLessonProgress = (courseId, topicIdx) => lessonProgress?.[courseId]?.[topicIdx] || 0;
  const getSavedVideoTime = (courseId, topicIdx) => videoPositions?.[courseId]?.[topicIdx] || 0;

  const writeVideoTime = (courseId, topicIdx, value) => {
    const nextValue = Math.max(0, Math.floor(value || 0));
    const next = {
      ...videoPositions,
      [courseId]: {
        ...(videoPositions[courseId] || {}),
        [topicIdx]: nextValue,
      },
    };
    setVideoPositions(next);
    safeLs.set("rs_course_video_pos4", next);
  };

  const clearVideoTime = (courseId, topicIdx) => {
    const courseMap = { ...(videoPositions[courseId] || {}) };
    delete courseMap[topicIdx];
    const next = { ...videoPositions, [courseId]: courseMap };
    setVideoPositions(next);
    safeLs.set("rs_course_video_pos4", next);
  };

  const writeLessonProgress = (courseId, topicIdx, value) => {
    const current = getSavedLessonProgress(courseId, topicIdx);
    const nextValue = Math.max(current, value);
    const next = {
      ...lessonProgress,
      [courseId]: {
        ...(lessonProgress[courseId] || {}),
        [topicIdx]: nextValue,
      },
    };
    setLessonProgress(next);
    safeLs.set("rs_course_lesson_progress4", next);
    return nextValue;
  };

  const getModuleProgress = (courseId, topicIdx) => getSavedLessonProgress(courseId, topicIdx);

  const getCourseProgress = (courseId, total) => {
    if (!total) return 0;
    let sum = 0;
    for (let i = 0; i < total; i += 1) sum += getModuleProgress(courseId, i);
    return Math.round(sum / total);
  };

  const completeTopic = (courseId, topicIdx, total) => {
    const current = progress[courseId] || [];
    if (current.includes(topicIdx)) {
      showToast(copy.alreadyDoneToast, "info");
      return;
    }

    const nextProgress = { ...progress, [courseId]: [...current, topicIdx] };
    setProgress(nextProgress);
    safeLs.set("rs_course_prog4", nextProgress);
    writeLessonProgress(courseId, topicIdx, 100);
    clearVideoTime(courseId, topicIdx);
    addXPfn(15);
    showToast(copy.lessonDoneToast, "success");

    if (nextProgress[courseId].length === total) {
      setTimeout(() => {
        SFX.levelUp();
        showToast(`${copy.courseDoneToast} +50 XP`, "success");
        onUnlockAchieve("course_complete");
        addXPfn(50);
      }, 400);
    }
  };

  const openLesson = (course, topic, idx) => {
    if (!hasCourseAccess(course)) {
      SFX.error();
      showToast(copy.premiumLockedTitle, "info");
      return;
    }
    setActiveLesson({ course, topic, idx, watchStarted: false, resumeTime: getSavedVideoTime(course.id, idx) });
    setCanCompleteLesson(false);
    SFX.tap();
  };

  const closeLesson = () => {
    setActiveLesson(null);
    setCanCompleteLesson(false);
    SFX.close();
  };

  const startLesson = () => {
    if (!activeLesson) return;
    if (!activeLesson.watchStarted) {
      setActiveLesson((prev) => (prev ? { ...prev, watchStarted: true } : prev));
      SFX.tap();
    }
  };
  const markLessonReady = () => {
    if (!activeLesson) return;
    setCanCompleteLesson(true);
  };

  const finishLesson = () => {
    if (!activeLesson) return;
    if (!canCompleteLesson) {
      showToast(copy.inProgress, "info");
      SFX.tap();
      return;
    }
    completeTopic(activeLesson.course.id, activeLesson.idx, activeLesson.course.topics.length);
    closeLesson();
  };

  const handleQuizAnswer = (idx) => {
    if (quizAnswer !== null || !quizQ) return;

    setQuizAnswer(idx);
    const correct = idx === quizQ.correct;
    if (correct) {
      setQuizScore((prev) => prev + 1);
      SFX.quizCorrect();
      addXPfn(20);
    } else {
      SFX.quizWrong();
    }

    setTimeout(() => {
      if (quizIdx < safeQuizData.length - 1) {
        setQuizIdx((prev) => prev + 1);
        setQuizAnswer(null);
      } else {
        const finalScore = quizScore + (correct ? 1 : 0);
        setQuizDone(true);
        setStreak((prev) => ({ ...prev, totalQuizCorrect: prev.totalQuizCorrect + finalScore, lastQuizDate: today }));
        safeLs.set("rs_streak4", { ...safeStreak, totalQuizCorrect: safeStreak.totalQuizCorrect + finalScore, lastQuizDate: today });
        SFX.levelUp();
        addXPfn(50);
        showToast(`${finalScore}/${safeQuizData.length} · +50 XP`, "success");
        if (finalScore >= 5) onUnlockAchieve("quiz_master");
        if (quizStart && Date.now() - quizStart < 120000) onUnlockAchieve("speed_quiz");
      }
    }, 1200);
  };
  if (quizMode) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14, animation: "cardIn .35s ease both" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => { setQuizMode(false); setQuizIdx(0); setQuizScore(0); setQuizAnswer(null); setQuizDone(false); SFX.close(); }} style={{ width: 38, height: 38, borderRadius: 12, border: `1px solid ${th.border}`, background: th.card, color: th.sub, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 900, color: th.text }}>{t.quizTitle}</div>
          </div>
        </div>

        <div style={{ height: 5, borderRadius: 999, background: th.border, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${((quizIdx + (quizDone ? 1 : 0)) / safeQuizData.length) * 100}%`, borderRadius: 999, background: th.grad, transition: "width .35s ease" }} />
        </div>

        {quizDone ? (
          <div style={{ textAlign: "center", padding: "50px 20px", animation: "cardIn .4s cubic-bezier(.34,1.56,.64,1) both", position: "relative" }}>
            <div style={{
              position: "absolute", top: "20%", left: "50%", transform: "translate(-50%, -50%)",
              width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${th.accent}30 0%, transparent 60%)`,
              filter: "blur(20px)", pointerEvents: "none", zIndex: 0
            }} />
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16, animation: "achieveFloat 4s ease-in-out infinite", position: "relative", zIndex: 1, filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.3))" }}><SystemIcon name="trophy" size={80} color={th.text} animated tone="glow" /></div>
            <div style={{ fontSize: 28, fontWeight: 900, color: th.text, marginBottom: 12, letterSpacing: "-.02em", position: "relative", zIndex: 1 }}>{copy.resultTitle}</div>
            <div style={{
              fontSize: 56, fontWeight: 900, marginBottom: 8, position: "relative", zIndex: 1,
              background: `linear-gradient(135deg, ${th.accent}, #fff, ${th.accent})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
             }}><SystemIcon name="check" size={44} color={th.accent} animated /></div>
            <div style={{ fontSize: 15, fontWeight: 800, color: th.accent, marginBottom: 8, position: "relative", zIndex: 1, textTransform: "uppercase", letterSpacing: ".05em" }}>
              {quizScore >= 7 ? copy.resultGreat : quizScore >= 5 ? copy.resultGood : copy.resultLearn}
            </div>
            <div style={{ fontSize: 13, color: th.sub, marginBottom: 32, position: "relative", zIndex: 1, fontWeight: 600 }}>{copy.quizDoneSub}</div>
            <button
              onClick={() => runAfterTap(() => { setQuizMode(false); setQuizIdx(0); setQuizScore(0); setQuizAnswer(null); setQuizDone(false); SFX?.tap?.(); })}
              style={{
                background: th.grad, color: th.btnTxt, border: "none", borderRadius: 16, padding: "16px 36px",
                fontSize: 15, fontWeight: 900, cursor: "pointer", boxShadow: th.shadow, position: "relative", zIndex: 1,
                transition: "transform .2s cubic-bezier(.34,1.56,.64,1)"
              }}
              onMouseEnter={isMobilePerf ? undefined : e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={isMobilePerf ? undefined : e => e.currentTarget.style.transform = "translateY(0)"}
              onTouchStart={isMobilePerf ? undefined : e => e.currentTarget.style.transform = "scale(0.95)"}
              onTouchEnd={isMobilePerf ? undefined : e => e.currentTarget.style.transform = "scale(1)"}
            >
              {copy.doneBtn}
            </button>
          </div>
        ) : (
          <div style={{ background: `linear-gradient(180deg, ${th.card} 0%, rgba(8,9,20,1) 100%)`, borderRadius: 28, border: `1px solid ${th.border}`, padding: 28, animation: "cardIn .35s cubic-bezier(.34,1.56,.64,1) both", boxShadow: "0 12px 40px rgba(3,4,8,0.4)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: th.accent, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".1em", background: `${th.accent}15`, padding: "4px 12px", borderRadius: 999, border: `1px solid ${th.accent}30` }}>
                {copy.questionLabel} {quizIdx + 1} / {safeQuizData.length}
              </div>
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: th.text, marginBottom: 28, lineHeight: 1.4, letterSpacing: "-.01em" }}>{quizQ.q}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {quizQ.opts.map((opt, i) => {
                let bg = "rgba(255,255,255,0.03)";
                let brd = "rgba(255,255,255,0.08)";
                let clr = "rgba(255,255,255,0.85)";
                let icon = "";
                let shadow = "none";

                if (quizAnswer !== null) {
                  if (i === quizQ.correct) {
                    bg = "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))";
                    brd = "#10b981";
                    clr = "#34d399";
                    icon = "check";
                    shadow = "0 0 20px rgba(16,185,129,0.2)";
                  } else if (i === quizAnswer) {
                    bg = "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))";
                    brd = "#ef4444";
                    clr = "#f87171";
                    icon = "close";
                  }
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleQuizAnswer(i)}
                    style={{
                      padding: "16px 20px", borderRadius: 18, border: `1px solid ${brd}`,
                      background: bg, color: clr, cursor: quizAnswer !== null ? "default" : "pointer",
                      fontSize: 15, fontWeight: 700, textAlign: "left",
                      transition: "background .2s ease, border-color .2s ease, transform .2s cubic-bezier(.34,1.56,.64,1), box-shadow .2s ease",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      boxShadow: shadow
                    }}
                    onMouseEnter={isMobilePerf ? undefined : e => { if (quizAnswer === null) { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.transform = "translateX(4px)"; } }}
                    onMouseLeave={isMobilePerf ? undefined : e => { if (quizAnswer === null) { e.currentTarget.style.background = bg; e.currentTarget.style.borderColor = brd; e.currentTarget.style.transform = "translateX(0)"; } }}
                  >
                    <span>{opt}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 18 }}>{icon ? <SystemIcon name={icon} size={16} color={clr} animated /> : null}</span>
                  </button>
                );
              })}
            </div>
            {quizAnswer !== null && (
              <div style={{
                marginTop: 20, padding: "16px 20px", borderRadius: 16,
                background: "linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.05) 100%)",
                border: `1px solid rgba(99,102,241,0.2)`,
                fontSize: 13, color: "rgba(224,231,255,0.9)",
                animation: "cardIn .35s cubic-bezier(.34,1.56,.64,1) both",
                lineHeight: 1.6, fontWeight: 500, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)"
              }}>
                <SystemIcon name="idea" size={16} color="rgba(224,231,255,0.88)" animated style={{ marginRight: 6 }} /> {quizQ.exp}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (selCourse) {
    const courseProgress = getCourseProgress(selCourse.id, selCourse.topics.length);
    const courseUnlocked = hasCourseAccess(selCourse);

    return (
      <>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, animation: "cardIn .35s ease both" }}>
          <button onClick={() => { setSelCourse(null); SFX.close(); }} style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: `1px solid ${th.border}`, background: th.card, color: th.sub, cursor: "pointer", fontSize: 13, fontWeight: 700 }}>← {copy.backToCourses}</button>

          <div style={{ position: "relative", overflow: "hidden", borderRadius: 28, border: `1px solid rgba(255,255,255,0.1)`, background: "#050608", boxShadow: "0 24px 60px rgba(0,0,0,0.35)" }}>
            <img src={selCourse.img} srcSet={getOptimizedSrcSet(selCourse.img)} sizes="(max-width: 520px) 100vw, 520px" alt={selCourse.title} loading="eager" decoding="async" fetchPriority="high" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.25, filter: "contrast(1.15) saturate(1.1)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,8,10,.3) 0%, rgba(8,8,10,.85) 50%, rgba(8,9,20,1) 100%)" }} />

            <div style={{ position: "relative", zIndex: 1, padding: "32px 24px 28px", display: "flex", flexDirection: "column", minHeight: 280, justifyContent: "flex-end" }}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                <span style={{ padding: "5px 12px", borderRadius: 999, background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)", backdropFilter: "blur(10px)", color: "#fff", fontSize: 10, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".1em" }}>{copy.classroomTitle}</span>
                <span style={{ padding: "5px 12px", borderRadius: 999, background: selCourse.free ? "rgba(16,185,129,.2)" : "rgba(245,158,11,.2)", border: `1px solid ${selCourse.free ? "rgba(16,185,129,.4)" : "rgba(245,158,11,.4)"}`, backdropFilter: "blur(10px)", color: selCourse.free ? "#34d399" : "#fbbf24", fontSize: 10, fontWeight: 900 }}>{fmt(selCourse.price)}</span>
                <span style={{ padding: "5px 12px", borderRadius: 999, background: courseUnlocked ? "rgba(16,185,129,.15)" : "rgba(255,255,255,.05)", border: courseUnlocked ? "1px solid rgba(16,185,129,.35)" : "1px solid rgba(255,255,255,.12)", backdropFilter: "blur(10px)", color: courseUnlocked ? "#34d399" : "rgba(255,255,255,.7)", fontSize: 10, fontWeight: 900 }}>
                  {courseUnlocked ? copy.moduleStatusReady : copy.lockedCourse}
                </span>
                {selCourse.popular && <span style={{ padding: "5px 12px", borderRadius: 999, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontSize: 10, fontWeight: 900, boxShadow: "0 4px 12px rgba(99,102,241,.4)", display: "inline-flex", alignItems: "center", gap: 5 }}><SystemIcon name="top" size={10} color="#fff" animated /> TOP</span>}
              </div>
              <div style={{ fontSize: 34, fontWeight: 900, color: "#fff", lineHeight: 1.1, letterSpacing: "-.03em", marginBottom: 12, textShadow: "0 6px 20px rgba(0,0,0,0.5)" }}>{selCourse.title}</div>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,.85)", lineHeight: 1.6, maxWidth: 540, marginBottom: 20, fontWeight: 500, textShadow: "0 2px 10px rgba(0,0,0,0.4)" }}>{selCourse.desc}</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", borderTop: "1px solid rgba(255,255,255,.1)", paddingTop: 16 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,.9)", fontSize: 12, fontWeight: 700 }}><SystemIcon name="clock" size={12} color="rgba(255,255,255,.6)" /> {selCourse.duration}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,.9)", fontSize: 12, fontWeight: 700 }}><SystemIcon name="template" size={12} color="rgba(255,255,255,.6)" /> {selCourse.lessons} {t.courseLessons}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,.9)", fontSize: 12, fontWeight: 700 }}><SystemIcon name="star" size={12} color="#fbbf24" animated /> {selCourse.rating}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,.9)", fontSize: 12, fontWeight: 700 }}><SystemIcon name="users" size={12} color="rgba(255,255,255,.6)" /> {selCourse.students.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div style={{ background: `linear-gradient(180deg, ${th.card} 0%, rgba(8,9,20,.95) 100%)`, borderRadius: 26, border: `1px solid ${th.border}`, padding: "20px 24px", boxShadow: "0 12px 32px rgba(3,4,8,0.3)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 18, fontWeight: 900, color: th.text, letterSpacing: "-.02em" }}>{copy.classroomTitle}</div>
                <div style={{ fontSize: 13, color: th.sub, marginTop: 4, fontWeight: 600 }}>{courseUnlocked ? copy.classroomSub : copy.premiumLockedText}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: courseUnlocked ? th.accent : "#fbbf24", fontFamily: "var(--font-number)" }}>{courseUnlocked ? `${courseProgress}%` : fmt(selCourse.price)}</div>
                <div style={{ fontSize: 11, color: th.sub, fontWeight: 800, textTransform: "uppercase", letterSpacing: ".05em" }}>{courseUnlocked ? t.courseProgress : copy.orderCourse}</div>
              </div>
            </div>
            {courseUnlocked ? (
              <>
                <div style={{ height: 10, borderRadius: 999, background: "rgba(255,255,255,.05)", overflow: "hidden", marginBottom: 12, boxShadow: "inset 0 1px 4px rgba(0,0,0,0.2)" }}>
                  <div style={{ height: "100%", width: `${courseProgress}%`, borderRadius: 999, background: th.grad, transition: "width .8s cubic-bezier(.34,1.56,.64,1)", boxShadow: "0 0 12px rgba(99,102,241,.5)" }} />
                </div>
                <div style={{ fontSize: 12, color: th.sub, lineHeight: 1.6, fontWeight: 600 }}>{copy.lessonHint}</div>
              </>
            ) : (
              <div
                style={{
                  marginTop: 12,
                  borderRadius: 18,
                  padding: 16,
                  background: `linear-gradient(180deg, ${th.surface} 0%, ${th.card} 100%)`,
                  border: `1px solid ${th.border}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: th.text, marginBottom: 6 }}>{copy.premiumLockedTitle}</div>
                  <div style={{ fontSize: 12, color: th.sub, lineHeight: 1.65 }}>{copy.premiumOrderHint}</div>
                </div>
                <button
                  onClick={() => {
                    SFX.order();
                    openTg("Rivaldsg", `${lang === "en" ? "Hi! I want access to the course:" : "Привет! Хочу доступ к курсу:"} ${selCourse.title}`);
                  }}
                  style={{ background: th.grad, color: th.btnTxt, border: "none", borderRadius: 16, padding: "14px 16px", fontSize: 14, fontWeight: 900, cursor: "pointer", boxShadow: th.shadow }}
                >
                  <SystemIcon name="telegram" size={13} color={th.btnTxt} animated style={{ marginRight: 6 }} /> {copy.orderCourse} вЂ” {fmt(selCourse.price)}
                </button>
              </div>
            )}
          </div>

          <div>
            <div style={{ fontSize: 18, fontWeight: 900, color: th.text }}>{copy.lessonsTitle}</div>
            <div style={{ fontSize: 12, color: th.sub, marginTop: 4 }}>{selCourse.topics.length} {lang === "en" ? "modules in this flow" : "модулей в этом потоке"}</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            {selCourse.topics.map((topic, idx) => (
              <ModuleCard key={topic} th={th} lang={lang} course={selCourse} topic={topic} idx={idx} done={!!progress[selCourse.id]?.includes(idx)} progress={getModuleProgress(selCourse.id, idx)} locked={!courseUnlocked} onOpen={() => openLesson(selCourse, topic, idx)} />
            ))}
          </div>

        </div>

        {activeLesson && (
          <LessonModal
            th={th}
            lang={lang}
            activeLesson={activeLesson}
            canComplete={canCompleteLesson}
            onClose={closeLesson}
            onStart={startLesson}
            onFinish={finishLesson}
            onPlaybackEnded={markLessonReady}
            onSaveTime={(time) => activeLesson && writeVideoTime(activeLesson.course.id, activeLesson.idx, time)}
            onClearSavedTime={() => activeLesson && clearVideoTime(activeLesson.course.id, activeLesson.idx)}
            isDone={!!(activeLesson && progress[activeLesson.course.id]?.includes(activeLesson.idx))}
          />
        )}
      </>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div>
        <div style={{ fontSize: 22, fontWeight: 900, color: th.text }}>{t.coursesTitle}</div>
        <div style={{ fontSize: 12, color: th.sub, marginTop: 2 }}>{t.courseSub}</div>
      </div>

      <div onClick={() => runAfterTap(() => {
        if (safeStreak.lastQuizDate === today) {
          SFX.error();
          showToast(copy.dailyQuizDone, "info");
          return;
        }
        setQuizMode(true);
        setQuizStart(Date.now());
        SFX.quiz();
        addXPfn(5);
      })} style={{ background: safeStreak.lastQuizDate === today ? th.surface : th.grad, borderRadius: 22, padding: "18px 20px", cursor: safeStreak.lastQuizDate === today ? "not-allowed" : "pointer", boxShadow: th.shadow, display: "flex", alignItems: "center", gap: 14, opacity: safeStreak.lastQuizDate === today ? 0.6 : 1, transition: "background .25s ease, opacity .25s ease, transform .25s ease" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}><SystemIcon name="brain" size={40} color={th.btnTxt} animated tone="glow" /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: th.btnTxt }}>{safeStreak.lastQuizDate === today ? (<span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><SystemIcon name="check" size={13} color={th.btnTxt} animated /> {copy.quizDoneTitle}</span>) : t.quizTitle}</div>
          <div style={{ fontSize: 12, color: th.btnTxt + "bb", marginTop: 2 }}>{safeStreak.lastQuizDate === today ? copy.quizReturnTomorrow : `${safeQuizData.length} ${copy.quizDailyHint}`}</div>
        </div>
        <span style={{ fontSize: 22, color: th.btnTxt }}>→</span>
      </div>

      <div style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
        {cats.map((item) => (
          <button key={item} onClick={() => { if (cat === item) return; runAfterTap(() => { setCat(item); SFX.filter(); }); }} style={{ whiteSpace: "nowrap", padding: "7px 14px", borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: "pointer", background: cat === item ? th.grad : "transparent", color: cat === item ? th.btnTxt : th.sub, border: `1px solid ${cat === item ? "transparent" : th.border}`, flexShrink: 0 }}>
            {item === "all" ? t.filterAll : item}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((course, i) => {
          const courseProgress = getCourseProgress(course.id, course.topics.length);
          const courseUnlocked = hasCourseAccess(course);
          return (
            <div key={course.id} onClick={() => { setSelCourse(course); SFX.course(); }} style={{ background: th.card, borderRadius: 22, border: `1px solid ${th.border}`, overflow: "hidden", cursor: "pointer", animation: `cardIn .35s ease ${i * 0.05}s both`, contentVisibility: "auto", containIntrinsicSize: "320px" }}>
              <div style={{ position: "relative" }}>
                <img src={course.img} srcSet={getOptimizedSrcSet(course.img)} sizes="(max-width: 520px) 100vw, 420px" alt={course.title} loading="lazy" decoding="async" style={{ width: "100%", height: 145, objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,8,10,.12) 0%, rgba(8,8,10,.55) 100%)" }} />
                <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 6 }}>
                  {course.popular && <span style={{ padding: "3px 8px", borderRadius: 999, background: th.accent, color: th.btnTxt, fontSize: 9, fontWeight: 900, display: "inline-flex", alignItems: "center", gap: 4 }}><SystemIcon name="top" size={9} color={th.btnTxt} animated /> TOP</span>}
                  <span style={{ padding: "3px 8px", borderRadius: 999, background: course.free ? "#10b981" : "#fbbf24", color: course.free ? "#fff" : "#000", fontSize: 9, fontWeight: 900 }}>{fmt(course.price)}</span>
                  {!courseUnlocked && <span style={{ padding: "3px 8px", borderRadius: 999, background: "rgba(8,8,10,.72)", color: "#fff", fontSize: 9, fontWeight: 900, border: "1px solid rgba(255,255,255,.12)", display: "inline-flex", alignItems: "center" }}><SystemIcon name="lock" size={10} color="#fff" /></span>}
                </div>
                {courseProgress > 0 && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "rgba(0,0,0,.35)" }}><div style={{ height: "100%", width: `${courseProgress}%`, background: th.grad }} /></div>}
              </div>
              <div style={{ padding: "14px 16px" }}>
                <div style={{ fontSize: 15, fontWeight: 900, color: th.text, marginBottom: 4 }}>{course.title}</div>
                <div style={{ fontSize: 12, color: th.sub, marginBottom: 10, lineHeight: 1.55 }}>{course.desc}</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: 10, color: th.accent, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: th.accent + "18" }}>{course.level}</span>
                  <span style={{ fontSize: 10, color: th.sub, display: "inline-flex", alignItems: "center", gap: 4 }}><SystemIcon name="clock" size={10} color={th.sub} /> {course.duration}</span>
                  <span style={{ fontSize: 10, color: th.sub, display: "inline-flex", alignItems: "center", gap: 4 }}><SystemIcon name="template" size={10} color={th.sub} /> {course.lessons} {t.courseLessons}</span>
                  <span style={{ fontSize: 10, color: "#fbbf24", display: "inline-flex", alignItems: "center", gap: 4 }}><SystemIcon name="star" size={10} color="#fbbf24" animated /> {course.rating}</span>
                  <span style={{ fontSize: 10, color: th.sub, marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 4 }}><SystemIcon name="users" size={10} color={th.sub} /> {course.students.toLocaleString()}</span>
                </div>
                {!courseUnlocked && (
                  <div style={{ marginTop: 10, fontSize: 11, color: th.sub, lineHeight: 1.55 }}>
                    {copy.premiumLockedText}
                  </div>
                )}
                {courseProgress > 0 && <div style={{ marginTop: 10 }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 10, color: th.sub, fontWeight: 600 }}>{t.courseProgress}</span><span style={{ fontSize: 10, color: th.accent, fontWeight: 700 }}>{courseProgress}%</span></div><div style={{ height: 4, borderRadius: 999, background: th.border, overflow: "hidden" }}><div style={{ height: "100%", width: `${courseProgress}%`, background: th.grad }} /></div></div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
