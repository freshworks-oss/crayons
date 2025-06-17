import FwProgress from 'multi-nprogress';

export interface ProgressLoaderOptions {
  /**
   * Changes the minimum percentage used upon starting. Default is `0.08`
   */
  minimum?: number;
  /**
   * Adjust animation settings using easing (a CSS easing string). Default is `ease`
   */
  easing?: string;
  /**
   * Add speed (in ms). Default is `200`
   */
  speed?: number;
  /**
   * Turn on/off the automatic incrementing behavior by setting this to false. Default is `true`
   */
  trickle?: boolean;
  /**
   * Adjust how often to trickle/increment, in ms. Default is `200`
   */
  trickleSpeed?: number;
  /**
   * Specify a selector to change the parent container. Default is `body`
   * Selector is accessed internally via document.querySelector method
   */
  parent?: string;
  /**
   * Use Custom markup. To keep the progress bar working, keep an element with class='bar' in there
   */
  template?: string;
}

export interface ProgressLoaderMethods {
  start: any;
  done: any;
  set: any;
  inc: any;
}

interface ProgressLoaderPropOptions extends ProgressLoaderOptions {
  show?: boolean;
}

const DEFAULT_OPTIONS = {
  parent: 'body',
  minimum: 0.08,
  easing: 'ease',
  speed: 200,
  trickle: true,
  trickleSpeed: 200,
  template:
    '<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="1"></div>',
  show: false,
};
export function getPropOptions(
  opts: ProgressLoaderPropOptions = {}
): ProgressLoaderPropOptions {
  return {
    parent: opts.parent ?? DEFAULT_OPTIONS.parent,
    minimum: opts.minimum ?? DEFAULT_OPTIONS.minimum,
    easing: opts.easing ?? DEFAULT_OPTIONS.easing,
    speed: opts.speed ?? DEFAULT_OPTIONS.speed,
    trickle: opts.trickle ?? DEFAULT_OPTIONS.trickle,
    trickleSpeed: opts.trickleSpeed ?? DEFAULT_OPTIONS.trickleSpeed,
    template: opts.template ?? DEFAULT_OPTIONS.template,
    show: opts.show ?? DEFAULT_OPTIONS.show,
  };
}

export function createProgressLoaderContainer(
  options: ProgressLoaderOptions
): ProgressLoaderMethods {
  const customizedOptions = {
    ...getPropOptions(options),
    barSelector: '[role="progressbar"]',
  };

  const instance = FwProgress().configure(customizedOptions);

  if (!document.querySelector('#fw-progress-bar-style')) {
    const style = document.createElement('style');
    style.id = 'fw-progress-bar-style';
    style.innerHTML = `
            .nprogress .bar {
              background: var(--progress-loader-color,var(--color-fill-brand, #2c5cc5));
              position: fixed;
              z-index: 1031;
              top: 0;
              left: 0;
              width: 100%;
              height: var(--progress-loader-height,2px);
            }
            .nprogress-custom-parent {
              overflow: hidden;
              position: relative;
            }
            .nprogress-custom-parent .nprogress .bar {
              position: absolute;
            }
      `;
    document.head.appendChild(style);
  }

  return {
    start: wrapFn(instance.start, customizedOptions),
    done: wrapFn(instance.done, customizedOptions),
    set: wrapFn(instance.set, customizedOptions),
    inc: wrapFn(instance.inc, customizedOptions),
  };
}
function wrapFn(fn, options) {
  return function (...arr) {
    try {
      if (options.parent) {
        if (!document.querySelector(options.parent)) {
          console.error(`Document Selector ${options.parent} not found`);
          return;
        }
      }
      fn.apply(this, arr);
    } catch (error) {
      console.error(
        `Error occurred in calling Progress Loader Functions`,
        error
      );
    }
  };
}
