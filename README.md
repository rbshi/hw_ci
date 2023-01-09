# Readme

This repo provides a web ui for multiple vivado builds.


## RUNME
```
cd nodejs_be && export WATCH_DIRS=$HOME/Workspace/hw/build_A:$HOME/Workspace/hw/build_B && npm start &
cd react_req && export NODE_OPTIONS=--openssl-legacy-provider && npm start &

Open the page at: localhost:3000

```

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
