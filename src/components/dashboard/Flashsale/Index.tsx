import { Button, DataTable, LegacyCard, Modal, Page, Pagination, TextContainer } from "@shopify/polaris";
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import priceFormat from "../../../utils/priceFormat";
import dateFormat from "../../../utils/dateFormat";

interface Product {
    id: number;
    name: string;
    image: string;
    description: string;
    regularPrice: string;
    salePrice: string;
    collection: {
        id: number;
        name: string;
    };
    variants: {
        id: number;
        title: string;
        value: string[];
        price: number[];
    }[];
}

interface FlashSale {
    id: number
    discountValue: string
    discountType: number
    products: Product[]
    dateStart: string
    dateEnd: string
}

interface FlashsaleRes {
    data: {
        success: boolean,
        data: FlashSale[],
        message: string,
    }
}

const Index = () => {
    const [active, setActive] = useState(false);
    const [activeDelete, setActiveDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(0);
    const dataTable = useRef<any[][]>([[]]);
    const [fls, setFls] = useState<FlashSale[] | []>([])
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const handleChangeDelete = useCallback(() => setActiveDelete(!activeDelete), [activeDelete]);
    const PRODUCT_PAGE =  5
    const [deleteStatus, setDeleteStatus] = useState(false);


    const handleDeleteFLS = useCallback(async() =>{
        const deteleFls = await axios.post("http://localhost:4000/api/flashsale/deleteFls", {
            id: deleteId,
        })
        if(deteleFls.data.success){
            handleChangeDelete();
            setDeleteStatus(true)
            alert("Xóa thành công")
        }
    },[deleteId])

    const handleDelete = (id: number) =>{
        setDeleteId(id);
        handleChangeDelete()
    }

    const handleAddNewFlashSale = useCallback(() =>{
        navigate("/flashsale/create")
    },[])

    useEffect(() =>{
        const fetchSale =  async () => {
            const response = await axios.get<any, FlashsaleRes>("http://localhost:4000/api/flashsale/get-all-flashsale");
            if(response.data.success) {
                setFls(response.data.data);
                dataTable.current =  response.data.data.map((item)  => ([
                    ...Object.values({
                        id: "#"+item.id,
                        discountType: item.discountType === 1 ? "giảm giá theo phần trăm" : "giảm giá trực tiếp",
                        discountValue: item.discountType === 1 ? `- ${item.discountValue} %`: priceFormat.format(Number(item.discountValue)) ,
                        products: item.products.length,
                        dateStart: dateFormat(item.dateStart),
                        dateEnd: dateFormat(item.dateEnd)
                    }),
                    <>
                      <span style={{ marginRight: '8px' }}>
                        <Button onClick={() =>{ navigate(`/flashsale/${item.id}`)}}>Sửa</Button> 
                      </span>
                      <Button onClick={() => handleDelete(item.id)}>Xóa</Button>
                    </>
                  ]))
                  setCurrentPage(1);
                  setTotalPage(Math.ceil(response.data.data.length / PRODUCT_PAGE));
            }
        }
        fetchSale()
    },[deleteStatus])
    return (
        <React.Fragment>
            <Page primaryAction={<Button primary onClick={handleAddNewFlashSale}> Thêm mới khung giờ flash sale </Button>}>
                <LegacyCard>
                <LegacyCard.Section>
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
                            "Mã",
                            "Loại giảm giá",
                            "Giảm giá",
                            "Tổng sản phẩm",
                            "thời gian bắt đầu",
                            "thời gian kết thúc",
                            "Hành động"
                        ]}
                        rows={dataTable.current}
                    />
                </LegacyCard.Section>
                </LegacyCard>
                <div style={{ margin: '12px auto', display: "flex", justifyContent: "center" }}>
                <Pagination
                    label={`${currentPage} / ${totalPage}`}
                    hasPrevious={!(currentPage <= 1)}
                    onPrevious={() => {
                    setCurrentPage((pre) => (pre - 1))
                    }}
                    hasNext={!(currentPage >= totalPage)}
                    onNext={() => {
                    setCurrentPage((pre) => (pre + 1))
                    }}
                />
                </div>
                <Modal
                    open={activeDelete}
                    onClose={handleChangeDelete}
                    title="Xóa khung giờ khuyến mãi"
                    primaryAction={{
                        content: 'Xóa',
                        onAction: handleDeleteFLS,
                    }}
                    secondaryActions={[
                        {
                        content: 'Đóng',
                        onAction: handleChangeDelete,
                        },
                    ]}
                >
                <Modal.Section>
                    <TextContainer>
                    <p>
                        Bạn có chắc muốn xóa flashsale
                    </p>
                    </TextContainer>
                </Modal.Section>
                </Modal>
            </Page>
        </React.Fragment>
    )
}

export default Index
