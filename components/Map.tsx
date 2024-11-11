"use client";
import React, { useState, useEffect } from "react";
import Konva from "konva";
import { Stage, Layer, Line, Shape } from "react-konva";
import { data } from "../app/data";

interface ShapeData {
  color?: string;
  points: number[];
}
interface MapData {
  name: string;
  outer: ShapeData;
  holes: ShapeData;
}

const Map = () => {
  const [zoomStage, setStage] = useState({
    scale: 1,
    x: 0,
    y: 0,
  });
  const [hoveredShape, setHoveredShape] = useState<number>(-1);
  const [mapData, setMapData] = useState<MapData[] | undefined>(undefined);

  useEffect(() => {
    if (data) setMapData(data as MapData[]);
  }, []);

  const handleStageZoom = (e: Konva.KonvaEventObject<WheelEvent>): void => {
    e.evt.preventDefault();

    const scaleBy = 1.02;
    const stage = e.target.getStage();
    if (stage) {
      const oldScale = stage.scaleX();
      const pointerPosition = stage.getPointerPosition();

      if (!pointerPosition) {
        return;
      }

      const mousePointTo = {
        x: pointerPosition.x / oldScale - stage.x() / oldScale,
        y: pointerPosition.y / oldScale - stage.y() / oldScale,
      };

      const newScale =
        e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
      setStage({
        scale: newScale,
        x: (pointerPosition.x / newScale - mousePointTo.x) * newScale,
        y: (pointerPosition.y / newScale - mousePointTo.y) * newScale,
      });
    }
  };

  const handleMouseEnter = (index: number) => setHoveredShape(index); // Set hovered shape index
  const handleMouseLeave = () => setHoveredShape(-1); // Reset hovered shape

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onWheel={handleStageZoom}
      scaleX={zoomStage.scale}
      scaleY={zoomStage.scale}
      x={zoomStage.x}
      y={zoomStage.y}
      draggable
    >
      <Layer>
        {mapData &&
          mapData.map((sh, index) =>
            (sh.holes.points?.length ?? 0) === 0 ? (
              <Line
                key={index}
                closed
                points={sh.outer.points}
                fill={hoveredShape === index ? "orange" : sh.outer.color}
                stroke={hoveredShape === index ? "black" : ""}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                opacity={0.5}
                draggable
              />
            ) : (
              <Shape
                key={index}
                sceneFunc={(context, shape) => {
                  // Draw the outer shape
                  context.beginPath();
                  context.moveTo(sh.outer.points[0], sh.outer.points[1]);
                  for (let i = 2; i < sh.outer.points.length; i += 2) {
                    context.lineTo(sh.outer.points[i], sh.outer.points[i + 1]);
                  }
                  context.closePath();

                  // Draw the hole shape
                  context.moveTo(sh.holes.points[0], sh.holes.points[1]);
                  for (let i = 2; i < sh.holes.points.length; i += 2) {
                    context.lineTo(sh.holes.points[i], sh.holes.points[i + 1]);
                  }
                  context.closePath();
                  context.stroke();
                  context.fillStrokeShape(shape);
                }}
                strokeWidth={2}
                opacity={0.5}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                draggable
              />
            )
          )}
        {/* <Path
          data="M 50 50 L 150 50 L 150 150 L 50 150 Z M 75 75 L 125 75 L 125 125 L 75 125 Z"
          fill="blue"
          fillRule="evenodd" // This creates the hole by following the "evenodd" rule
          stroke="black"
          strokeWidth={2}
        /> */}
      </Layer>
    </Stage>
  );
};
export default Map;
