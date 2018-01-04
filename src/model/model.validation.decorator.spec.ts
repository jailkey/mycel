import { Model } from './model';
import { Validation } from './model.validation.decorator';
import { Require } from '../validation/validations/require';
import { MinLength } from '../validation/validations/minlength';
 
class MyTestModel extends Model {
    constructor() {
        super();
    }

    @Validation(Require)
    public myProperty : string = '';

    @Validation(MinLength(5))
    public anotherProperty : string = '';
}

describe('Model Validation Decorator', () => {
    let model = new MyTestModel()

    it('tests if the first validation decorator is existing', async (done) => {
        let properties = await model.properties();
        expect(properties[0].name).toBe('myProperty')
        expect(properties[0].validations[0].type).toBe('validation')
        expect(properties[0].validations[0].value === Require).toBeTruthy();
        done()
    });

    it('tests if the second validation decorator is existing', async (done) => {
        let properties = await model.properties();
        expect(properties[1].name).toBe('anotherProperty')
        expect(properties[1].validations[0].type).toBe('validation')
        done()
    });

    it('it validates the properties and checks if they are invalid', async (done) => {
        let validations = await model.validate();
        expect(validations['myProperty'].isValid).toBeFalsy();
        expect(validations['anotherProperty'].isValid).toBeFalsy();
        done();
    })

    it('it validates the properties with data and checks if they are valid', async (done) => {
        let validations = await model.validate({
            myProperty : 'something',
            anotherProperty : 'something'
        });
        expect(validations['myProperty'].isValid).toBeTruthy();
        expect(validations['anotherProperty'].isValid).toBeTruthy();
        done();
    })


})