
### Pulsar

`<tenant>/<namespace>/<topic>`

## Schema

Schemas can be applied to a topic. Guarantees that topics posted conform to what is expected.

### Compatibility check

    | Strategy            | Changes Allowed      | Check schemas  | Upgrade first |
    | ------------------- | -------------------- | -------------- | ------------- |
    | ALWAYS_INCOMPATIBLE | All are disabled     | all previous   | None          |
    | ALWAYS_COMPATIBLE   | All are allowed      | Latest version | Depends       |
    | BACKWARD            | Delete, Add optional | Latest version | Consumers     |
    | FORWARD             | Add, Delete optional | Latest version | Producers     |
    | FULL                | optional fields      | Latest version | Any Order     |
