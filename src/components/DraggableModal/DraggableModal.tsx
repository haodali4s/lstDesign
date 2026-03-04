import { ModalForm } from "@ant-design/pro-components";
import React, { useCallback } from "react";
import type { ComponentProps } from "react";

export interface DraggableModalProps {
  children: React.ReactElement<ComponentProps<typeof ModalForm>>;
}

const DraggableModal: React.FC<DraggableModalProps> = (props) => {
  const { children } = props;

  const draggable = useCallback((node: HTMLDivElement) => {
    {
      let drag = false;
      let originX = 0;
      let originY = 0;
      let startX = 0;
      let startY = 0;
      let maxX = [-Infinity, Infinity];
      let maxY = [-Infinity, Infinity];
      let animationFrame: number | undefined;
      const canBeDragged = (e: MouseEvent) => {
        const { top } = node.getBoundingClientRect();
        const regex = /(-?\d+\.?\d*)/g;
        const style = getComputedStyle(node.children[0]);

        const availableTop =
          parseFloat(
            style.paddingTop ?? (style.paddingTop as string).match(regex)![0],
          ) + top;

        return e.clientY > top && !(e.clientY > availableTop);
      };
      let isDragStarted = false;

      const dragging = (e: MouseEvent) => {
        if (drag && e.buttons === 1) {
          let xMove = e.clientX - startX;
          let yMove = e.clientY - startY;

          // 防误触：移动距离大于 5px 才判定为拖拽开始
          if (!isDragStarted) {
            if (Math.abs(xMove) < 5 && Math.abs(yMove) < 5) {
              return;
            }
            isDragStarted = true;
          }

          document.body.style.cursor = "move";
          animationFrame = requestAnimationFrame(() => {
            node.style.userSelect = "none";

            // 重新获取一下当前相对坐标系里的 xMove yMove，并且限制边界
            if (xMove < maxX[0]) {
              xMove = maxX[0];
            }
            if (xMove > maxX[1]) {
              xMove = maxX[1];
            }
            if (yMove < maxY[0]) {
              yMove = maxY[0];
            }
            if (yMove > maxY[1]) {
              yMove = maxY[1];
            }
            node.style.transform = `translate(${xMove}px, ${yMove}px)`;
          });
        }
      };
      const dragOver = () => {
        if (drag) {
          drag = false;
          isDragStarted = false; // 重置防误触标志
          document.body.style.cursor = "default";
          node.style.cursor = "default";
          node.style.userSelect = "auto";
          const regex = /(-?\d+\.?\d*)/g;
          const matches = node.style.transform.match(regex);
          if (matches && matches.length > 0) {
            originX += parseFloat(matches[0]);
            originY += parseFloat(matches[1]);
            node.style.left = `${originX}px`;
            node.style.top = `${originY}px`;
          }
          document.onmouseup = null;
          document.onmousemove = null;

          node.style.transform = "";
          animationFrame && cancelAnimationFrame(animationFrame);
        }
      };
      if (node) {
        node.addEventListener("mousemove", (e: MouseEvent) => {
          if (drag || canBeDragged(e)) {
            node.style.cursor = "move";
          } else {
            node.style.cursor = "default";
          }
        });
        node.onmousedown = (e) => {
          if (canBeDragged(e)) {
            if (e.buttons === 1) {
              drag = true;
              startX = e.clientX;
              startY = e.clientY;
              const { left, top, right, bottom } = node.getBoundingClientRect();
              maxX = [
                Math.min(-left, 0),
                Math.max(window.innerWidth - right, 0),
              ];
              maxY = [
                Math.min(-top, 0),
                Math.max(window.innerHeight - bottom, 0),
              ];
              document.onmousemove = dragging;
              document.onmouseup = dragOver;
            }
          }
        };
      }
    }
  }, []);
  if (!React.isValidElement(children) || children.type !== ModalForm) {
    console.error("Children must be a ModalForm component");
    return null;
  }

  return React.cloneElement(children, {
    modalProps: {
      ...children.props.modalProps,
      modalRender: (content) => (
        <div style={{ width: "100%", position: "absolute" }} ref={draggable}>
          {content}
        </div>
      ),
    },
  });
};

export default DraggableModal;
