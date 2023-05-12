type MoveCommand = {
    from: string
    to: string
    item : string
}

type ApiResponse = {
    content : string
    author : string
}



export type {
    MoveCommand,
    ApiResponse
}