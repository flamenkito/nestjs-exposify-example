/**
 * Class decorator that logs the decorated class name when the class is defined.
 */
export function Facade(): ClassDecorator {
  return (target: Function) => {
    console.log(`[Facade] ${target.name}`);
  };
}
