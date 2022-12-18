import React from 'react';
import {useState, useEffect} from 'react';
import axios from 'axios';
//Style
import './App.css';
import '@coreui/coreui/dist/css/coreui.min.css'
//UI
import {
    CSmartTable,
    CBadge,
    CButton,
    CButtonGroup,
    CCollapse,
    CCardBody,
    CTable,
    CModal,
    CModalTitle,
    CModalHeader,
    CModalFooter,
    CModalBody,
    CForm,
    CFormTextarea
} from '@coreui/react-pro'


//global
const url_get_build = 'http://ethz.rbshi.me:3010/build_coyote'
const url_put_note = 'http://ethz.rbshi.me:3010/note'


function buildStatus(nev) {
    if (nev.event['vivado_error'].length) {
        return 'error'
    } else if (nev.event['coyote_base'][nev.event['coyote_base'].length - 1].process === 'Bitstreams coppied') {
        return 'done'
    } else {
        return 'baking'
    }
}

async function translateFromNetEvents(net_events) {
    let evs = []
    for (const nev of net_events) {
        const ev = {
            build_dir: nev.dir,
            design: 'tba',
            status: buildStatus(nev),
            details: nev.event
            // details: [nev.event.coyote_base, nev.event.vivado_base, nev.event.vivado_error]
        }
        evs.push(ev)
    }
    return evs
}

const getBadge = (status) => {
    switch (status) {
        case 'done':
            return 'dark'
        case 'Inactive':
            return 'secondary'
        case 'baking':
            return 'primary'
        case 'error':
            return 'danger'
        default:
            return 'light'
    }
}


function App() {

    const [events, setEvents] = useState([])
    const [details, setDetails] = useState([])
    const [modals, setModals] = useState(0)
    const [noteMsg, setNoteMsg] = useState('')


    useEffect(() => {

        const fetchData = async () => {
            const net_events = await axios.get(url_get_build)
            const evs = await translateFromNetEvents(net_events.data)
            setEvents(evs)
        }

        fetchData().then();
    }, [])

    const handleNoteMsg = event => {
        setNoteMsg(event.target.value);
    };


    const toggleCompArray = (array, setArray, index) => {
        const position = array.indexOf(index)
        let newArray = array.slice()
        if (position !== -1) {
            newArray.splice(position, 1)
        } else {
            newArray = [...array, index]
        }
        setArray(newArray)
    }


    const columns = [
        {key: 'build_dir', label: 'Build', _style: {width: '5%'}},
        {key: 'design', label: 'Design', _style: {width: '10%'}},
        {key: 'status', label: 'Build Status', _style: {width: '10%'}},
        {key: 'show_details', label: '', _style: {width: '1%'}, filter: false},
    ]

    return (
        <div className="SmartTable">
            <CSmartTable
                activePage={1}
                clickableRows
                columns={columns}
                items={events}
                itemsPerPageSelect
                itemsPerPage={50}
                pagination
                scopedColumns={{
                    status: (item) => (
                        <td>
                            <CBadge color={getBadge(item.status)}>{item.status}</CBadge>
                        </td>
                    ),
                    show_details: (item) => {
                        return (
                            <td className="py-2">
                                <CButtonGroup>
                                    <CButton
                                        color="dark"
                                        variant="outline"
                                        shape="square"
                                        size="sm"
                                        onClick={() => { toggleCompArray(details, setDetails, item._id) } }
                                    >
                                        {details.includes(item._id) ? 'Hide' : 'Details'}
                                    </CButton>
                                    <CButton
                                        color="primary"
                                        shape="square"
                                        variant="outline"
                                        size="sm"
                                        onClick={async () => {
                                            //get note from backend
                                            let rd_resp = await axios.put(url_put_note, {action: 'rd', build_dir: item['build_dir']})
                                            setNoteMsg(rd_resp.data['msg'])
                                            setModals(item._id+1) //hide the modal when setModals(0)
                                        }}
                                        >
                                        Notes
                                    </CButton>
                                </CButtonGroup>
                            </td>
                        )
                    },
                    details: (item) => {
                        return (
                            <CCollapse visible={details.includes(item._id)}>
                                <CCardBody>
                                    <h4>Vivado Error</h4>
                                    <CTable striped small bordered color="dark" items={item.details['vivado_error']}/>
                                    <h4>Vivado Process</h4>
                                    {/*<pre>{JSON.stringify(item.details.vivado_error, null, 4)}</pre>*/}
                                    <CTable striped small bordered color="dark" items={item.details['vivado_base']}/>
                                </CCardBody>
                            </CCollapse>
                        )
                    },
                }}
                // selectable
                tableFilter
                tableProps={{
                striped: true,
                hover: true,
            }}
                />

            <CModal size="xl" visible={(modals>0)}
                onClose={() => setModals(0)}>
                <CModalHeader>
                    <CModalTitle>Notes: { (modals>0) ? events[modals-1]['build_dir'] : null } </CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CFormTextarea
                            id="textAreaBuildNode"
                            label=""
                            rows="8"
                            value={noteMsg}
                            onChange={handleNoteMsg}
                        ></CFormTextarea>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="light"
                        onClick={() => setModals(0)}>Close</CButton>
                    <CButton color="primary" onClick={async () => {
                        let build_dir = events[modals-1]['build_dir']
                        let wr_resp = await axios.put(url_put_note, {action: 'wr', build_dir: build_dir, msg: noteMsg} );
                        console.log(wr_resp.data.msg)
                        setModals(0)
                    }}>Save changes</CButton>
                </CModalFooter>
            </CModal>

        </div>
    );

}

    export default App;
