import { update } from "../astro-engine/astro.js";
import { getMousePosition, mouseDown, mouseUp } from "../astro-engine/core/input.js";
import { Vector } from "../astro-engine/util/vector.js";
import { TILE_SIZE } from "./grid.js";
import { updateBrushTool } from "./tools/brush.js";
import { endLineTool, startLineTool, updateLineTool } from "./tools/line.js";
import { endRectangleTool, startRectangleTool, updateRectangleTool } from "./tools/rectangle.js";

export const tools = {
    mouse: "mouse",
    brush: "brush",
    rectangle: "rectangle",
    line: "line",
}

export let activeTool = tools.mouse;

export const setTool = (toolName) => {
    if (!tools[toolName])
        return console.warn(`Could not select tool called ${toolName}. Tool not found.`);

    endRectangleTool();
    activeTool = tools[toolName];
}

export const getTool = () => activeTool;

let previousSelectedTile;

mouseUp(() => {
    const mousePosition = getMousePosition();
    const tilePosition = new Vector(
        Math.round(mousePosition.x / TILE_SIZE),
        Math.round(mousePosition.y / TILE_SIZE)
    );

    if (activeTool === tools.rectangle)
        endRectangleTool(tilePosition);
    else if (activeTool === tools.line)
        endLineTool(tilePosition);
});

mouseDown(() => {
    const mousePosition = getMousePosition();
    const tilePosition = new Vector(
        Math.round(mousePosition.x / TILE_SIZE),
        Math.round(mousePosition.y / TILE_SIZE)
    );

    if (activeTool === tools.rectangle)
        startRectangleTool(tilePosition);
    else if (activeTool === tools.line)
        startLineTool(tilePosition);
});

update(deltaTime => {
    const mousePosition = getMousePosition();
    const tilePosition = new Vector(
        Math.round(mousePosition.x / TILE_SIZE),
        Math.round(mousePosition.y / TILE_SIZE)
    );

    if (activeTool === tools.brush)
        updateBrushTool(deltaTime, tilePosition, previousSelectedTile);
    else if (activeTool === tools.rectangle)
        updateRectangleTool(tilePosition);
    else if (activeTool === tools.line)
        updateLineTool(tilePosition);

    previousSelectedTile = tilePosition;
});