declare module 'd3-shape' {
  export interface CurveFactory {
    (context: any): any;
  }
  export interface DefaultArcObject {
    innerRadius: number;
    outerRadius: number;
    startAngle: number;
    endAngle: number;
    padAngle: number;
  }
}

declare module 'd3-scale' {
  export interface ScaleLinear<Domain, Range> {
    (value: Domain): Range;
    domain(domain: Domain[]): this;
    range(range: Range[]): this;
  }
  export interface ScaleBand<Domain> {
    (value: Domain): number;
    domain(domain: Domain[]): this;
    range(range: [number, number]): this;
  }
  export interface ScalePoint<Domain> {
    (value: Domain): number;
    domain(domain: Domain[]): this;
    range(range: [number, number]): this;
  }
  export interface ScaleTime<Domain, Range> {
    (value: Domain): Range;
    domain(domain: Domain[]): this;
    range(range: Range[]): this;
  }
}

declare module 'd3-selection' {
  export interface BaseType {
    [key: string]: any;
  }
} 