# Readme

This repo provides a web ui for multiple vivado builds.

## Notes
* If open vivado in the build folder, the default build log `vivado.log` is replaced. TODO: change the build log name, send to node.js as env.

* Add some fault-tolarant behavior, e.g., if return empty event.


## Data structure

### FrontEnd (react.js)
```
events
{
    [ev]
}

ev
{
    build_dir: net_event.dir
    design: 'tba'
    status: buildStatus(net_event)
    timing: 'wns'
    details: net_event.event
}

```
### BackEnd (express.js)
```
net_events
{
    [ { dir, net_event, mtime } ]
}

net_event
{
    vivado_base: [ { process, time, tail, type } ]
    vivado_error: [ { error, type } ]
    vivado_timing: {wns, type}
    coyote_base: [ { process, type } ]
}
```

### Process of adding new dissector
* Add $dissector_name.js under libs/dissectors
* Import in libs/dissectors/index.js
* Update event initializer in app.js (`parse_even` function)

* At frontend, add elements in `translateFromNetEvents` function
