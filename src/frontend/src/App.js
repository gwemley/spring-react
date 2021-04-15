import {useState, useEffect} from 'react';
import {deleteStudent, getAllStudents} from "./client";
import {
  Layout,
  Menu,
  Breadcrumb,
  Table,
  Empty,
  Spin,
  Button,
  Badge,
  Tag,
  Row,
  Col,
  Popconfirm,
  Radio,
  Image
} from "antd"
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import './App.css';
import StudentDrawerForm from "./StudentDrawerForm";
import Avatar from "antd/es/avatar/avatar";
import {errorNotification, successNotification} from "./Notification";

const {Header, Content, Footer, Sider} = Layout;
const {SubMenu} = Menu;

const TheAvatar = ({name}) => {
  // nama tidak ada
  let trim = name.trim();
  if (trim.length === 0) {
    return <Avatar style={{color: '#f56a00', backgroundColor: '#fde3cf'}} icon={<UserOutlined/>}/>
  }
  // nama sebaris ambil huruf depan
  let split = name.split(" ");
  if (split.length === 1) {
    return <Avatar style={{color: '#f56a00', backgroundColor: '#fde3cf'}} icon={name.charAt(0).toUpperCase()}/>
  }

  let name2nd = name.split(" ");
  return <Avatar style={{color: '#f56a00', backgroundColor: '#fde3cf'}}>
    {`${name.charAt(0).toUpperCase()}${name2nd[1].charAt(0).toUpperCase()}`}
  </Avatar>
}

const removeStudent = (studentId, callback) => {
  deleteStudent(12).then(() => {
    successNotification("Student deleted", `${studentId.name} was deleted`);
    callback();
  }).catch(err => {
    err.response.json().then(res => {
      console.log(res)
      errorNotification(
          "There was an issue",
          `${res.message} [${res.status}] [${res.error}]`,
          "bottomLeft"
      )
    })
  })
}

const columns = fetchStudents => [
  {
    title: '',
    dataIndex: 'avatar',
    key: 'avatar',
    render: (text, student) => <TheAvatar name={student.name}/>

  },
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender',
  },
  {
    title: 'Action',
    key: 'Action',
    render: (text, student) =>
        <Radio.Group>
          <Popconfirm
              // icon=<SyncOutlined spin/>
              placement='topRight'
              title={`Are you sure to delete this ${student.name}?`}
              onConfirm={() => removeStudent(student.id, fetchStudents)}
              okText="Yes"
              cancelText="No">
            <Radio.Button value="small" type="dashed">Delete</Radio.Button>
          </Popconfirm>
          <Radio.Button value="small" type="dashed">Edit</Radio.Button>
        </Radio.Group>

  }

];

function App() {
  const [students, setStudents] = useState([]);
  const [collapsed, setCollapsed] = useState(true);
  const [fetchData, setFetchData] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);

  const fetchStudents = () =>
      getAllStudents()
          .then(res => res.json())
          .then(data => {
            console.log(data);
            setStudents(data);
            setFetchData(false);
          })
      //     .catch(err => {
      //   console.log(err.response)
      //    err.response.json().then(res => {
      //      console.log(res);
      //      errorNotification(
      //          "There was an issue",
      //          `${res.message} [${res.status}] [${res.error}]`
      //      )
      //    });
      // }).finally(() => setFetchData(false))

  useEffect(() => {
    console.log("component is mounted")
    fetchStudents();
  }, []);

  const renderStudents = () => {
    if (fetchData) {
      return <Spin tip="Loading...">
      </Spin>
    }
    if (students <= 0) {
      return <>
        <Button onClick={() => setShowDrawer(!showDrawer)}
                type="primary" shape="round" icon={<PlusOutlined/>} size={'medium'}>
          Add New Student
        </Button>,
        <Empty/>
        <StudentDrawerForm
            showDrawer={showDrawer}
            setShowDrawer={setShowDrawer}
            fetchStudents={fetchStudents}
        />
      </>
    }
    return <>
      <StudentDrawerForm
          showDrawer={showDrawer}
          setShowDrawer={setShowDrawer}
          fetchStudents={fetchStudents}
      />
      <Table dataSource={students}
             columns={columns(fetchStudents)}
             bordered
             title={() => <>
               <Row gutter={16}>
                 <Col span={12}>
                   <Button onClick={() => setShowDrawer(!showDrawer)}
                           type="primary" shape="round" icon={<PlusOutlined/>} size={'medium'}>
                     Add New Student
                   </Button>,
                 </Col>
                 <Col span={12}>
                   <div
                       style={{
                         textAlign: 'right',
                       }}
                   >
                     <Tag color="gold" style={{marginTop: "5px"}}>Number of Students</Tag>
                     <Badge count={students.length} className="site-badge-count-4"/>
                   </div>
                 </Col>
               </Row>

             </>}
             pagination={{pageSize: 50}}
             scroll={{y: 400}}
             rowKey={(student) => student.id}
      />
    </>

  }

  return <Layout style={{minHeight: '100vh'}}>
    <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
      <div className="logo"/>
      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
        <Menu.Item key="1" icon={<PieChartOutlined/>}>
          Option 1
        </Menu.Item>
        <Menu.Item key="2" icon={<DesktopOutlined/>}>
          Option 2
        </Menu.Item>
        <SubMenu key="sub1" icon={<UserOutlined/>} title="User">
          <Menu.Item key="3">Tom</Menu.Item>
          <Menu.Item key="4">Bill</Menu.Item>
          <Menu.Item key="5">Alex</Menu.Item>
        </SubMenu>
        <SubMenu key="sub2" icon={<TeamOutlined/>} title="Team">
          <Menu.Item key="6">Team 1</Menu.Item>
          <Menu.Item key="8">Team 2</Menu.Item>
        </SubMenu>
        <Menu.Item key="9" icon={<FileOutlined/>}>
          Files
        </Menu.Item>
      </Menu>
    </Sider>
    <Layout className="site-layout">
      <Header className="site-layout-background" style={{padding: 0}}/>
      <Content style={{margin: '0 16px'}}>
        <Breadcrumb style={{margin: '16px 0'}}>
          <Breadcrumb.Item>User</Breadcrumb.Item>
          <Breadcrumb.Item>Bill</Breadcrumb.Item>
        </Breadcrumb>
        <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
          {renderStudents()}
        </div>
      </Content>
      <Footer style={{textAlign: 'center'}}>
        <Image widht={20} src="https://www.pngkey.com/png/detail/167-1671420_al-quran-icon-png.png"/>
      </Footer>
    </Layout>
  </Layout>
}

export default App;