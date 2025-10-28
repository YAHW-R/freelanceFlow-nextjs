

import { CREATE_TYPE_ARRAY } from "../global"
import { Client, Project, Task } from "../types"

export const indentifyCreateResponseAi = (aiResponse: string) => {
    const firstLine = aiResponse.split('\n')[0]
    const indexCreate = CREATE_TYPE_ARRAY.map((createType, i) => {
        if (firstLine === createType) {
            return i
        }
    })

    return indexCreate[0] ?? null

}


export const parseAiResponse = (aiResponse: string) => {

    const lines = aiResponse.split('\n')
    const aiResponseWithoutFirstLine = lines.slice(1).join('\n')

    if (!indentifyCreateResponseAi(aiResponse)) return null

    const createClientType = CREATE_TYPE_ARRAY[indentifyCreateResponseAi(aiResponse) as number]

    switch (createClientType) {
        case 'client':
            return { object: parseClient(aiResponseWithoutFirstLine), createClientType }
        case 'project':
            return { object: parseProject(aiResponseWithoutFirstLine), createClientType }
        case 'task':
            return { object: parseTask(aiResponseWithoutFirstLine), createClientType }
        default:
            return null
    }

}

const parseTask = (textTask: string) => {
    const task: Task = JSON.parse(textTask)
    return task
}

const parseProject = (textProject: string) => {
    const project: Project = JSON.parse(textProject)
    return project
}

const parseClient = (textClient: string) => {
    const client: Client = JSON.parse(textClient)
    return client
}