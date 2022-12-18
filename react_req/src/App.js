import './App.css';

import {
    CSmartTable,
    CBadge,
    CButton,
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
import {useState, useEffect} from 'react';
import axios from 'axios';

import React from 'react';

import '@coreui/coreui/dist/css/coreui.min.css'


const url_get_build = 'http://ethz.rbshi.me:3010/build_coyote'
const url_put_note = 'http://ethz.rbshi.me:3010/note'


function App() {

    const [events, setEvents] = useState([])
    const [details, setDetails] = useState([])
    const [visible, setVisible] = useState(false)

    useEffect(() => {

        function buildStatus(nev) {
            if (nev.event.vivado_error.length) {
                return 'error'
            } else if (nev.event.coyote_base[nev.event.coyote_base.length - 1].process === 'Bitstreams coppied') {
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


        const fetchData = async () => {
            const net_events = await axios.get(url_get_build)
            const evs = await translateFromNetEvents(net_events.data)
            setEvents(evs)
        }

        fetchData()
        // setTimeout(() => {
        //     fetchData()
        // }, 2000)
    }, [])


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
    const toggleDetails = (index) => {
        const position = details.indexOf(index)
        let newDetails = details.slice()
        if (position !== -1) {
            newDetails.splice(position, 1)
        } else {
            newDetails = [...details, index]
        }
        setDetails(newDetails)
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
                // cleaner
                clickableRows
                columns={columns}
                // columnFilter
                // columnSorter
                // footer
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
                                <CButton
                                    color="dark"
                                    variant="outline"
                                    shape="square"
                                    size="sm"
                                    onClick={() => {
                                        toggleDetails(item._id)
                                    }}
                                >
                                    {details.includes(item._id) ? 'Hide' : 'Details'}
                                </CButton>
                            </td>
                        )
                    },
                    details: (item) => {
                        return (
                            <CCollapse visible={details.includes(item._id)}>
                                <CCardBody>
                                    <h4>Vivado Error</h4>
                                    <CTable striped small bordered color="dark" items={item.details.vivado_error}/>
                                    <h4>Vivado Process</h4>
                                    {/*<pre>{JSON.stringify(item.details.vivado_error, null, 4)}</pre>*/}
                                    <CTable striped small bordered color="dark" items={item.details.vivado_base}/>
                                </CCardBody>
                            </CCollapse>
                        )
                    },
                }}
                // selectable
                sorterValue={{column: 'name', state: 'asc'}}
                tableFilter
                tableHeadProps={{
                    // color: 'danger',
                }}
                tableProps={{
                    striped: true,
                    hover: true,
                }}
            />

            <CButton onClick={() => setVisible(!visible)}>Launch demo modal</CButton>
            <CModal visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader onClose={() => setVisible(false)}>
                    <CModalTitle>Modal title</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CFormTextarea
                            id="exampleFormControlTextarea1"
                            label="Example textarea"
                            rows="8"
                            text="Must be 8-20 words long."
                            defaultValue="hello hello"
                        ></CFormTextarea>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>Close</CButton>
                    <CButton color="primary" onClick={async () => {
                        const response = await axios.put(url_put_note, "hello");
                        console.log(response)
                        setVisible(false)
                    }}>Save changes</CButton>
                </CModalFooter>
            </CModal>

        </div>
    );

}

export default App;
