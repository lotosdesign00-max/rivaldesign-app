import React, { useState, useEffect } from "react";

/**
 * ContextMenu — контекстное меню с богатым дизайном
 */

export default function ContextMenu({
  items = [],
  position = { x: 0, y: 0 },
  onClose,
  sfx,
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    sfx?.open?.();

    const handleClick = () => {
      handleClose();
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sfx?.close?.();
    setTimeout(onClose, 200);
  };

  const handleItemClick = (item) => {
    sfx?.tap?.();
    item.onClick?.();
    handleClose();
  };

  return (
    <>
      <style>{`
        @keyframes contextMenuIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes contextMenuOut {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.9) translateY(-10px);
          }
        }
        .context-menu {
          animation: contextMenuIn 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .context-menu.closing {
          animation: contextMenuOut 0.2s ease-out forwards;
        }
        .context-menu-item {
          transition: all 0.15s ease;
          cursor: pointer;
        }
        .context-menu-item:hover {
          background: rgba(99,102,241,0.15) !important;
          transform: translateX(4px);
        }
        .context-menu-item:active {
          transform: scale(0.96) translateX(4px);
        }
      `}</style>

      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9998,
          background: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(2px)",
          opacity: isVisible ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
        onClick={handleClose}
      />

      {/* Menu */}
      <div
        className={`context-menu ${!isVisible ? "closing" : ""}`}
        style={{
          position: "fixed",
          left: position.x,
          top: position.y,
          zIndex: 9999,
          minWidth: 200,
          background: "rgba(13,15,26,0.95)",
          border: "1px solid rgba(99,102,241,0.25)",
          borderRadius: 16,
          padding: 6,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          boxShadow: "0 12px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top shine */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "20%",
            right: "20%",
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)",
          }}
        />

        {items.map((item, index) => (
          <React.Fragment key={index}>
            {item.divider ? (
              <div
                style={{
                  height: 1,
                  background: "rgba(99,102,241,0.1)",
                  margin: "6px 8px",
                }}
              />
            ) : (
              <div
                className="context-menu-item"
                onClick={() => handleItemClick(item)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: "transparent",
                  color: item.danger ? "#ef4444" : "rgba(224,231,255,0.9)",
                }}
              >
                {item.icon && (
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: item.danger
                        ? "rgba(239,68,68,0.15)"
                        : "rgba(99,102,241,0.12)",
                      border: item.danger
                        ? "1px solid rgba(239,68,68,0.25)"
                        : "1px solid rgba(99,102,241,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 16,
                    }}
                  >
                    {item.icon}
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>
                    {item.label}
                  </div>
                  {item.description && (
                    <div
                      style={{
                        fontSize: 10,
                        color: "rgba(100,116,139,0.7)",
                        marginTop: 2,
                      }}
                    >
                      {item.description}
                    </div>
                  )}
                </div>
                {item.shortcut && (
                  <div
                    style={{
                      fontSize: 10,
                      color: "rgba(100,116,139,0.6)",
                      fontFamily: "monospace",
                      padding: "2px 6px",
                      borderRadius: 4,
                      background: "rgba(99,102,241,0.08)",
                    }}
                  >
                    {item.shortcut}
                  </div>
                )}
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
