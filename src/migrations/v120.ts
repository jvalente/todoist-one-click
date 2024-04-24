import { Storage } from '../api/extension'
import { updateDefaultRule } from '../controllers/rules'

export function v120() {
    return Storage.getAll().then((storage) => {
        const dueDate = storage?.dueDate?.data
        const labels = storage?.targetLabels?.data
        const projectId = storage?.targetProjectId?.data

        if (dueDate || labels || projectId) {
            updateDefaultRule({ dueDate, labels, projectId })
        }

        chrome.storage.local
            .remove(['dueDate', 'targetLabels', 'targetProjectId'])
            .then(() => {
                Storage.getAll().then((storage) => console.log(storage))
            })
    })
}
