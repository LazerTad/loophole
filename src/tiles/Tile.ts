import World from "../World";
import Canvas from "../Canvas";
import { getImage } from "../common";

export default class Tile {
    static width = 32
    update( world: World, x, y ) { }
    image( world: World, x, y, partialSteps ): HTMLImageElement | undefined { return getImage( this.constructor.name ) }
    draw( world: World, x, y, partialSteps ) { Canvas.image( this.image ) }
}