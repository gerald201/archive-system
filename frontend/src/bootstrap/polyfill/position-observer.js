class PositionObserver {
  static #keys = [
    'bottom',
    'left',
    'right',
    'top',
    'x',
    'y'
  ];

  #callback;
  #map;

  constructor(callback) {
    if(typeof callback != 'function') throw new Error(`Provided callback must be a function. '${typeof callback}' provided.`);

    this.#callback = callback;
    this.#map = new Map();
    this.#loop();
  }

  #loop() {
    const changedEntries = [];
  
    this.#map
      .forEach(function(values, target) {
        const check = PositionObserver.#keys
          .some(function(key) {
            return values[key] != target.getBoundingClientRect()[key];
          });

        if(check) {
          const position = PositionObserver.#keys
            .reduce(function(accumuator, key) {
              accumuator[key] = target.getBoundingClientRect()[key];
              return accumuator;
            }, {});
            
          changedEntries.push({
            position,
            target
          });
        }
      });

    if(changedEntries.length) {
      changedEntries
        .forEach(function(entry) {
          this.#map.set(entry.target, Object.assign({}, entry.position));
        });
      this.#callback(changedEntries, this);
    }

    requestAnimationFrame(loop);
  }

  disconnect() {
    this.#map.clear();
  }

  observe(element) {
    if(!(element instanceof HTMLElement)) throw new Error('\'element\' provided must be instance of \'HTMLElement\'.');

    if(this.#map.has(element)) return;

    const values = PositionObserver.#keys
      .reduce(function(accumuator, key) {
        accumuator[key] = 0;
        return accumuator;
      }, {});

    this.#map.set(element, values);
  }

  unobserve(element) {
    if(!(element instanceof HTMLElement)) throw new Error('\'element\' provided must be instance of \'HTMLElement\'.');

    if(!this.#map.has(element)) return;

    this.#map.delete(element);
  }
}

export default PositionObserver;
