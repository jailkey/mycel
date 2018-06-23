import { Service, NAMESPACE_PROPERTY_NAME, CHILDREN_PROPERTY_NAME } from './service';

@Service({
    namespace : 'PetersChild'
})
class PetersChild {
    public whoAmI: string = 'PetersChild'
}

@Service({
    namespace : 'HansPeter',
    children : [
        PetersChild
    ]
})
class HansPeter {
    public whoAmI: string = 'TheSuperMannClass'
}

describe('Tests if the @Service Decorator works!', () => {
    let instance;
    it('creates a new serivce instance.', () => {
        instance = new HansPeter();
    });

    it('checks if the property of the main service is working.', () => {
        expect(instance.whoAmI).toBe('TheSuperMannClass')
    });

    it('checks if the children propery is available', () => {
        expect(instance[CHILDREN_PROPERTY_NAME]).toBeDefined()
    })

    it('checks if the child service is instantiated well.', () => {
        expect(instance[CHILDREN_PROPERTY_NAME].length).toBe(1);
        expect(instance[CHILDREN_PROPERTY_NAME][0] instanceof PetersChild).toBeTruthy()
    })

    it('checks the property of the child service is working!', () => {
        expect(instance[CHILDREN_PROPERTY_NAME][0].whoAmI).toBe('PetersChild');
    })

    it('checks namespaces.', () => {
        expect(instance[NAMESPACE_PROPERTY_NAME]).toBe('HansPeter');
        expect(instance[CHILDREN_PROPERTY_NAME][0][NAMESPACE_PROPERTY_NAME]).toBe('PetersChild');
    })
})