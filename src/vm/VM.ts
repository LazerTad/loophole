import { instructionByCode } from "./instructions";

export enum ArgType {
    MEM_FIXED,
    MEM,
    MEM_OFFSET,
    REGISTER,
    PRIMITIVE
}

export default class VM {
    counter: number = 0
    counters: number[] = []
    program!: number[]
    memory!: number[]
    registers!: number[]
    // callbacks!: (x: number) =>

    static create( program: any[], memory: number, registers: number ) {
        let result = new VM()
        result.program = program
        result.memory = new Array( memory ).fill( 0 )
        result.registers = new Array( registers ).fill( 0 )
        return result
    }

    consume() {
        return this.program[ this.counter++ ]
    }

    getRef() {
        let rvalType = this.consume()
        switch ( rvalType ) {
            case ArgType.MEM_FIXED: {
                let addr = this.consume()
                return this.memory[ addr ]
            }

            case ArgType.MEM_OFFSET: {
                let register = this.consume()
                return this.memory[ this.registers[ register ] ]
            }

            case ArgType.MEM_OFFSET: {
                let register = this.consume()
                let offset = this.consume()
                return this.memory[ this.registers[ register ] + offset ]
            }

            case ArgType.REGISTER: {
                let register = this.consume()
                return this.registers[ register ]
            }

            case ArgType.PRIMITIVE:
                return this.consume()

            default:
                throw new Error( `Unrecognized rval type ${rvalType} at ${this.counter}` )
        }
    }

    setRef( x: number ) {
        let lvalType = this.consume()
        switch ( lvalType ) {
            case ArgType.MEM_FIXED: {
                let addr = this.consume()
                this.memory[ addr ] = x
                break
            }

            case ArgType.MEM: {
                let register = this.consume()
                this.memory[ this.registers[ register ] ] = x
                break
            }

            case ArgType.MEM_OFFSET: {
                let register = this.consume()
                let offset = this.consume()
                this.memory[ this.registers[ register ] + offset ] = x
                break
            }

            case ArgType.REGISTER: {
                let register = this.consume()
                this.registers[ register ] = x
                break
            }

            default:
                throw new Error( `Unrecognized lval type ${lvalType} at ${this.counter}` )
        }
    }

    step(): boolean {
        let instructionCode = this.consume()
        let instruction = instructionByCode( instructionCode )
        if ( instruction )
            instruction( this )
        else
            throw new Error( `Unknown instruction code ${instructionCode} at ${this.counter - 1}` )
        return this.counter < this.program.length
    }

    run() {
        while ( this.step() ) { }
    }
}