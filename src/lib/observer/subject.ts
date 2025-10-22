type Observer<T> = (data: T) => void

export class Subject<T> {
    observers: Observer<T>[] = []

    attach(observer: Observer<T>) {
        this.observers.push(observer)
    }

    detach(observer: Observer<T>) {
        const index = this.observers.indexOf(observer)
        if (index > -1) {
            this.observers.splice(index, 1)
        }
    }

    notify(data: T) {
        this.observers.forEach((observer) => {
            observer(data)
        })
    }
}
