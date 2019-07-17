import World from "../World";
import Canvas from "../Canvas";
import Tile from "./Tile";

export default class TileMoving extends Tile {
    dx = 0
    dy = 0

    move( dx, dy ) {
        let { world, x, y } = this
        let blocked = !world.isEmpty( x + dx, y + dy )
        let blockedX = !world.isEmpty( x + dx, y )
        let blockedY = !world.isEmpty( x, y + dy )
        let blockedXY = blockedX && blockedY
        if ( blocked || blockedXY ) dx = 0
        if ( blocked || blockedXY ) dy = 0
        this.dx += dx
        this.dy += dy
        world.remove( x, y )
        world.setTile( x + dx, y + dy, this )
    }

    update() {
        super.update()
        this.dx = 0
        this.dy = 0
    }

    draw( partialSteps ) {
        Canvas.push().translate( this.dx * Tile.width * ( partialSteps - 1 ), this.dy * Tile.width * ( partialSteps - 1 ) )
        this.drawAfterTranslation( partialSteps )
        Canvas.pop()
    }

    drawAfterTranslation( partialSteps ) {
        super.draw( partialSteps )
    }
}