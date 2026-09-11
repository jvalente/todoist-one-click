type Observer<T> = (data: T) => void

export class Subject<T> {
    private observers = new Set<Observer<T>>()

    attach(observer: Observer<T>): () => void {
        this.observers.add(observer)
        return () => this.observers.delete(observer)
    }

    notify(data: T) {
        this.observers.forEach((observer) => {
            observer(data)
        })
    }
}
