import {React,useEffect,useState} from "react";
import SideBarAdmin from "../Component/sideNavigationAdmin";
import "../CSS_file/sideNavigation.css";
import "../CSS_file/selectMenu.css";
import NavbarAdmin from "../Component/NavBarAdmin";
import { Row, Col, Alert, Card, Button } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import OrderConfirmCard from "../Component/orderDetailConfirm";
import axios from "axios";
import { useParams } from "react-router-dom";
import ShowMenuStock from "../Component/showMenuStock";
const OrderManagementPage = () => {
  const [orderData,setOrderData] = useState([]);
  const [sentID,setSentID] = useState(null);
  const [sentData,setSentData] = useState([]);
   const { staftID } = useParams();
  const [search,setSearch] = useState("");


//ดึงข้อมูล order ทั้งหมด
const fetchingFulldata = async () => {
  try {
    const response = await axios.post(
      `https://localhost:7202/api/Admin/GetOrder`,{
        orderID : search
      }
    );
    console.log("response :", response.data.orders);
    setOrderData(response.data.orders);
    
  } catch (error) {
    console.log("ไม่สามารถดึงข้อมูลได้");
  }
};
useEffect(() => {
  fetchingFulldata();
}, [search]);


const handleClick=async(orderID)=>{
   setSentID(orderID);
} 

const refrestPage = ()=>{
  fetchingFulldata();
}

  return (
    <div>
      <SideBarAdmin staftID={staftID}/>
      <NavbarAdmin staftID={staftID}/>
      <div className="mainMenu ">
        <p
          className="my-3 border border-dark bg-white p-2 rounded-5 d-flex justify-content-center"
          style={{ maxWidth: "220px" }}
        >
          รายการอาหาร 
        </p>
        <Row
          className=" d-flex justify-content-start"
          style={{ marginLeft: "8px" }}
        >
          <Col
            lg={7}
            md={5}
            sm={4}
            className="shadow-sm rounded-2 me-3 p-2 bg-white"
            style={{ minHeight: "440px" }}
          >
            <div className="d-flex justify-content-between  mb-3">
              <div className="d-flex">
              <Button variant="outline-dark me-3" onClick={refrestPage}><i class="bi bi-arrow-clockwise"></i></Button>
              <ShowMenuStock/>
              </div>

              <div
                className="search-container-box shadow-sm  "
                style={{ width: 300 }}
              >
                <div className="input-group ">
                  <input
                    type="text"
                    id="search"
                    placeholder="ค้นหารายการสั่ง..."
                    name="search"
                    className="form-control "
                    value={search}
                    onChange={(e)=>{setSearch(e.target.value)}}
                  />
                  <div className="input-group-append">
                    <span className="input-group-text bg-white border-0" style={{cursor:"pointer"}}>
                      <i className="bi bi-search"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {orderData?.length === 0?(
              <div className=" d-flex justify-content-center mt-4">
               <p className="text-secondary">ไม่พบรายการที่ต้องทำการตรวจสอบ</p>
              </div>
            ):(
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(12rem,17rem)",gap:"10px"}} >
              {orderData.map((item)=>(
            <Card  bg='white' text='dark' style={{ height:"11rem" }} className="shadow-sm">
                <Card.Header style={{fontSize:'1rem'}}>
                
                     รหัสการสั่งอาหาร : {item.orderID}
                
                </Card.Header>
                <Card.Body>
                  <div className="d-flex flex-row justify-content-between">
                  <Card.Title style={{fontSize:'1rem',lineHeight: "10px",}}>รหัสโต๊ะ : {item.tableID}</Card.Title>
                  {item.confirmOrder === "ยังไม่อนุมัติ"?(
                  <p className="bg-danger text-warning p-1 border rounded-3" style={{fontSize:"0.7rem"}}>NEW !</p>
                  ):(
                    <div>
                      <hr variant="secondary"/>
                      <p className="mb-4">{" "}</p>
                    </div>
                  )}
                  </div>
                  <Card.Text style={{fontSize:'0.8rem',lineHeight: "8px"}} >
                  จำนวนรายการ : {item.orderDetailList.reduce((totalQuant, currentItem) => totalQuant + currentItem.quantity, 0)}
                  </Card.Text>
                  <Button variant="outline-primary" onClick={()=>{handleClick(item.orderID)}}>
                    กดดูรายละเอียดเพื่อทำการยืนยัน
                    </Button>
                </Card.Body>
              </Card>
              ))}             
            </div>
            )}
          </Col>
          <Col
            lg={4}
            md={3}
            sm={4}
            className="shadow-sm p-2  rounded-2 bg-white "
            style={{
              position: "fixed",
              height: "490px",
              right: "10px",
              top: "80px",
              overflowY: "auto",
              
            }}
          >
            {sentID&& 
             <OrderConfirmCard orderID={sentID} staftID={staftID}/>
            }
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default OrderManagementPage;
