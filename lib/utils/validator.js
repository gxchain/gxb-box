export default {

    validate (params, schema) {
        let self = this;
        if (typeof params != 'object') {
            throw new Error(`params ${params} should be an object`);
        }

        if (typeof schema != 'object') {
            throw new Error(`schema ${schema} should be an object`);
        }

        let result = {};

        for (var key in schema) {
            let type = schema[key].type;
            let value = params[key];
            let defaultValue = schema[key].defaultsTo;

            // assign a default value if the value is not assigned
            if (typeof value == 'undefined' && typeof defaultValue != 'undefined') {
                value = defaultValue;
                result[key] = value;
            }

            // throw an error if value is required but not assigned
            if (typeof value == 'undefined' && schema[key].required) {
                throw new Error(`${key} in ${JSON.stringify(params, null, '\t')} is required`);
            }

            switch (type) {
                case 'integer':
                    if (!/^\d+$/.test(value)) {
                        throw new Error(`${key} should be a type of ${type}, but get a value of ${value}`);
                    } else {
                        result[key] = value;
                    }
                    break;
                case 'string':
                case 'boolean':
                case 'number':
                    if (typeof value != type) {
                        throw new Error(`In case of schema definition:${JSON.stringify(schema, null, '\t')},${key} in ${JSON.stringify(params, null, '\t')} should be a type of ${type}, but get a value of ${value} which indicated as type of ${typeof value}`);
                    } else {
                        result[key] = value;
                    }
                    break;
                case 'json':
                    if (!(value instanceof Object)) {
                        throw new Error(`${key} should be json, but get a value of ${value} which indicated as instance of ${value.constructor.name}`);
                    }
                    result[key] = self.validate(value, schema.fields || {});
                    break;
                case 'array':
                    if (!(value instanceof Array)) {
                        throw new Error(`${key} should be an instance of array, but get a value of ${value} which indicated as instance of ${value.constructor.name}`);
                    } else if (!schema[key].columns) {
                        throw new Error(`columns definition should be assigned for ${key} since schema ${schema}[${key}] is type of array`);
                    } else if (typeof schema[key].columns != 'object') {
                        throw new Error(`${key} should be an instance of array, but get a value of ${value} which indicated as instance of ${value.constructor.name}`);
                    } else {
                        result[key] = [];
                        value = value.forEach(function (item) {
                            result[key].push(self.validate(item, schema[key].columns));
                        });
                    }
                    break;
                case 'raw':
                    if (!(value instanceof Object)) {
                        throw new Error(`${key} should be json, but get a value of ${value} which indicated as instance of ${value.constructor.name}`);
                    }
                    result[key] = value;
                    break;
                default:
                    console.warn(`unknown type ${type} found in ${JSON.stringify(params, null, '\t')}, which is not supported at this time, will be ignored`);

            }
        }
        return result;
    }
};
