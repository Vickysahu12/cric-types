// Type definitions for cric-types

export declare class CricError extends Error {
  path: string;
  constructor(message: string, path: string);
}

export interface Validator<T> {
  parse(value: unknown): T;
  safeParse(value: unknown): { ok: true; value: T } | { ok: false; error: string };
  optional(): OptionalValidator<T>;
}

export interface OptionalValidator<T> extends Validator<T | undefined> {
  readonly __isOptional: true;
}

export declare const Sachin: Validator<number>;
export declare const Virat: Validator<string>;
export declare const Dhoni: Validator<boolean>;

type OptionalKeys<Shape> = {
  [K in keyof Shape]: Shape[K] extends OptionalValidator<any> ? K : never;
}[keyof Shape];

type RequiredKeys<Shape> = Exclude<keyof Shape, OptionalKeys<Shape>>;

type InferShape<Shape> = {
  [K in RequiredKeys<Shape>]: Shape[K] extends Validator<infer T> ? T : never;
} & {
  [K in OptionalKeys<Shape>]?: Shape[K] extends Validator<infer T> ? T : never;
};

export declare function Squad<Shape extends Record<string, Validator<any>>>(
  shape: Shape
): Validator<InferShape<Shape>>;

export declare function Team<T>(inner: Validator<T>): Validator<T[]>;

// Infer<typeof SomeSchema> gives you the plain TS type it validates
export type Infer<V> = V extends Validator<infer T> ? T : never;