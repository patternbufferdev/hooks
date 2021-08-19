type Config = {};

type ApplicatorFactory = (key: keyof Config) => Applicator;
type Applicator<K extends keyof Config = keyof Config> = (
  values?: Record<keyof Config[K], Config[K][keyof Config[K]]>,
  reset?: (keys?: Array<keyof Config[K]>) => void,
) => {
  apply: Applicator<K>;
  reset: (keys: Array<keyof Config[K]>) => void;
};

type GenericApplicatorFactoryFactory = <Source>(
  source: Partial<Source>,
) => GenericApplicatorFactory<Source>;
type GenericApplicatorFactory<Obj> = (key: keyof Obj) => GenericApplicator<typeof key>;
type GenericApplicator<Obj, K extends keyof Obj = keyof Obj> = (
  values?: Record<keyof Obj[K], Obj[K][keyof Obj[K]]>,
  reset?: (keys?: Array<keyof Obj[K]>) => void,
) => {
  apply: Applicator<K>;
  reset: (keys: Array<keyof Obj[K]>) => void;
};

interface IJsonable<T> {
  toJSON(): T;
}

type Primitive<Instance> = value_of<Instance> extends object
  ? Instance extends IJsonable<infer Raw>
    ? Primitive<Raw>
    : PrimitiveObject<Instance>
  : value_of<Instance>;

type PrimitiveObject<Instance> = {
  [P in keyof Instance]: Instance[P] extends Function ? never : Primitive<Instance[P]>;
};

type value_of<Instance> = Instance extends Boolean
  ? boolean
  : Instance extends Number
  ? number
  : Instance extends String
  ? string
  : Instance extends BigInt
  ? bigint
  : Instance;

/**
  alternative
 */

type __hack__Primitive<Instance> = __hack__value_of<Instance> extends object
  ? Instance extends IJsonable<infer Raw>
    ? Raw extends object
      ? __hack__PrimitiveObject<Raw>
      : __hack__value_of<Raw>
    : __hack__PrimitiveObject<Instance>
  : __hack__value_of<Instance>;

type __hack__PrimitiveObject<Instance> = {
  [P in keyof Instance]: Instance[P] extends Function ? never : __hack__Primitive<Instance[P]>;
};

type __hack__value_of<Instance> = Instance extends Boolean
  ? boolean
  : Instance extends Number
  ? number
  : Instance extends String
  ? string
  : Instance extends BigInt
  ? bigint
  : Instance;
