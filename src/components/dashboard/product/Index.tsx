import { Page, LegacyCard, DataTable, Button, Thumbnail, Modal, TextContainer } from "@shopify/polaris";
import axios from "axios";
import React, {useEffect, useState, useCallback} from "react";
import { useNavigate } from "react-router-dom";
import priceFormat from "../../../utils/priceFormat";

const Index = () => {
    const navigate = useNavigate()
    const [rows, setRows] = useState([]);
    const [active, setActive] = useState(false);
    const [deleteId, setDeleteId] = useState(0);
    const [deleteStatus, setDeleteStatus] = useState(false);

    const handleChange = useCallback(() => setActive(!active), [active]);
    const handleDeleteProduct = useCallback(async() =>{
      const fetchDeleteProduct = await axios.delete(`http://localhost:4000/api/product/delete`,{
        data:{
          id: deleteId
        }
      })
      if(fetchDeleteProduct.data.success){
        setDeleteStatus(true);
        setActive(!active)
      }
    },[active])
    useEffect(() => {
      const fetchData = async () =>{
        const response = await axios.get("http://localhost:4000/api/product/get-all-product")
        setRows(response.data.data.map((item: any)  => ([...Object.values(item), <><Button onClick={() =>{ navigate(`/admin/product/${item.id}`)}}>Sửa</Button> <Button onClick={() =>{setDeleteId(item.id);handleChange()}}>Xóa</Button></>])))
      }
      fetchData().then()
    }, [deleteStatus])


    
    const handleChangeRoute = () =>{
      navigate("/admin/product/create")
    }
    const newrow =  rows.map((item: [string, string]) => {
      return item.map((itemI, index) =>{
        if (index === 2){
          return (<Thumbnail
            source={`${itemI}`}
            alt="abc"
          />)
        }
        else if(index === 4 || index === 5){
          return priceFormat.format(Number(itemI)).toString()
        }else{
          return itemI
        }
      })
    })

    console.log(newrow);
    
    return (
      <React.Fragment>
        <Page title="Product" primaryAction={<Button primary onClick={handleChangeRoute}> Thêm mới sản phẩm </Button>}>
            <LegacyCard>
                <DataTable
                    columnContentTypes={[
                        "text",
                        "text",
                        "text",
                        "text",
                        "text",
                        "text",
                        "text"
                    ]}
                    headings={[
                        "id",
                        "Tên product",
                        "Ảnh SP",
                        "Mô tả",
                        "giá gốc",
                        "giá bán",
                        "Hành động"
                    ]}
                    rows={newrow}
                />
            </LegacyCard>
            <Modal
              open={active}
              onClose={handleChange}
              title="Xóa sản phẩm"
              primaryAction={{
                content: 'Xóa',
                onAction: handleDeleteProduct,
              }}
              secondaryActions={[
                {
                  content: 'Đóng',
                  onAction: handleChange,
                },
              ]}
            >
              <Modal.Section>
                <TextContainer>
                  <p>
                    Bạn có chắc muốn xóa sản phẩm
                  </p>
                </TextContainer>
              </Modal.Section>
            </Modal>
        </Page>
      </React.Fragment>

    );
}
export default Index