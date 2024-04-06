import TargetLabels from '../models/target-labels'

export function setLabels(currentLabels: any, newLabel: string) {
    TargetLabels.set([...currentLabels, newLabel])
}

export function removeLabel(currentLabels: any, label: string) {
    TargetLabels.set(currentLabels.filter((l: string) => l !== label))
}
