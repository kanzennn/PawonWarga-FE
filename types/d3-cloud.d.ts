declare module "d3-cloud" {
  export interface CloudWord {
    text: string;
    value?: number;
    size?: number;
    color?: string;
    font?: string;
    rotate?: number;
    x?: number;
    y?: number;
  }

  export interface Cloud<T extends CloudWord = CloudWord> {
    size(size: [number, number]): Cloud<T>;
    words(words: T[]): Cloud<T>;
    padding(padding: number | ((word: T, index: number) => number)): Cloud<T>;
    rotate(rotate: number | ((word: T, index: number) => number)): Cloud<T>;
    font(font: string | ((word: T, index: number) => string)): Cloud<T>;
    fontWeight(weight: string | number | ((word: T, index: number) => string | number)): Cloud<T>;
    fontSize(size: number | ((word: T, index: number) => number)): Cloud<T>;
    spiral(name: "archimedean" | "rectangular"): Cloud<T>;
    on(type: "end", listener: (words: T[]) => void): Cloud<T>;
    start(): Cloud<T>;
    stop(): Cloud<T>;
  }

  export default function cloud<T extends CloudWord = CloudWord>(): Cloud<T>;
}
