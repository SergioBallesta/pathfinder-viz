/**
 * Binary min-heap for priority queue operations.
 * Items are [priority, row, col] tuples.
 */
export type HeapItem = [number, number, number];

export class MinHeap {
  private data: HeapItem[] = [];

  push(item: HeapItem): void {
    this.data.push(item);
    let i = this.data.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (this.data[p][0] <= this.data[i][0]) break;
      [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
      i = p;
    }
  }

  pop(): HeapItem {
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      let i = 0;
      while (true) {
        let smallest = i;
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < this.data.length && this.data[l][0] < this.data[smallest][0]) smallest = l;
        if (r < this.data.length && this.data[r][0] < this.data[smallest][0]) smallest = r;
        if (smallest === i) break;
        [this.data[smallest], this.data[i]] = [this.data[i], this.data[smallest]];
        i = smallest;
      }
    }
    return top;
  }

  get size(): number {
    return this.data.length;
  }
}
