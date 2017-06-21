module.exports = {
    text(el, value) {
        const keypath = value;
        const type = 'property';

        this.register({
            el,
            keypath,
            type
        });
    },
    model(el, value) {
        const keypath = value;
        const type = 'event';

        this.register({
            el,
            keypath,
            type
        });
    }
};