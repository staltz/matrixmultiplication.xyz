import xs, {Stream, MemoryStream} from 'xstream';
import dropRepeats from 'xstream/extra/dropRepeats';
import objectExtend from './object-extend';

export type MainFn<Sources, Sinks> = (sources: Sources) => Sinks;
export type Reducer = (state: any) => any;

export default function onionify<So, Si>(main: MainFn<So, Si>, name: string = 'onion'): MainFn<So, Si> {
  return function augmentedMain(sources: So): Si {
    const reducerMimic$ = xs.create<Reducer>();
    const state$ = reducerMimic$.fold((state, reducer) => reducer(state), {});
    sources[name] = new StateSource(state$);
    const sinks = main(sources);
    reducerMimic$.imitate(sinks[name]);
    return sinks;
  }
}

export class StateSource<T> {
  public state$: MemoryStream<T>;

  constructor(stream: MemoryStream<any>) {
    this.state$ = stream;
  }

  select(scope: string): StateSource<any> {
    return new StateSource(this.state$.map(state => state[scope]));
  }

  isolateSource(source: StateSource<any>, scope: string): StateSource<any> {
    return source.select(scope);
  }

  isolateSink(reducer$: Stream<Reducer>, scope: string): Stream<Reducer> {
    return reducer$.map(reducer => function (state: any) {
      return objectExtend(state, {[scope]: reducer(state[scope])});
    });
  }
}