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

interface User {
    id: number,
    firstName: string,
    lastName: string,
    email: string,
}

interface Discount {
    id: number,
    name: string,
    value: string,
    type: number,
    minimumPrice: string,
    maximumDiscount: string,
    expiredDate: string,
    quantity: number,
    products: Product[],
    users: User[]
}

interface DiscountRes {
    data: {
        success: boolean,
        data: Discount[],
        message: string,
    }
}

const Index = () => {
    const [active, setActive] = useState(false);
    const [activeDelete, setActiveDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(0);
    const dataTable = useRef<any[][]>([[]]);
    const [discounts, setDiscounts] = useState<Discount[] | []>([])
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const handleChangeDelete = useCallback(() => setActiveDelete(!activeDelete), [activeDelete]);
    const PRODUCT_PAGE =  5
    const [deleteStatus, setDeleteStatus] = useState(false);


    const handleDeleteDiscount = useCallback(async() =>{
        const deteleFls = await axios.post("http://localhost:4000/api/discount/deleteDiscount", {
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

    const handleAddNewDiscount = useCallback(() =>{
        navigate("/discount/create")
    },[])

    useEffect(() =>{
        const fetchSale =  async () => {
            const response = await axios.get<any, DiscountRes>("http://localhost:4000/api/discount/get-all-discount");
            if(response.data.success) {
                setDiscounts(response.data.data);
                dataTable.current =  response.data.data.map((item)  => ([
                    ...Object.values({
                        id: "#"+item.id,
                        name: item.name,
                        value: item.type === 1 ? `${item.value}` : priceFormat.format(Number(item.value)),
                        minimumPrice: priceFormat.format(Number(item.minimumPrice)),
                        maximumDiscount: priceFormat.format(Number(item.maximumDiscount)),
                        quantity: item.quantity,
                        expiredDate: dateFormat(item.expiredDate),
                        products: item.products !== null ? item.products.length : 0,
                        user: item.users !== null ? item.users.length : 0
                    }),
                    <>
                      <span style={{ marginRight: '8px' }}>
                        <Button onClick={() =>{ navigate(`/discount/${item.id}`)}}>Sửa</Button> 
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
            <Page fullWidth primaryAction={<Button primary onClick={handleAddNewDiscount}> Thêm mới mã giảm giá </Button>}>
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
                            "text",
                            "text",
                            "text",
                            "text",
                        ]}
                        headings={[
                            "Mã",
                            "Tên giảm giá",
                            "Giá giảm",
                            "Giá tối thiểu",
                            "Giá giảm tối đa",
                            "Số lượng",
                            "Thời gian hết hạn",
                            "Số sản phẩm",
                            "Số khách hàng",
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
                    title="Xóa mã giảm giá"
                    primaryAction={{
                        content: 'Xóa',
                        onAction: handleDeleteDiscount,
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
                        Bạn có chắc muốn xóa mã giảm giá
                    </p>
                    </TextContainer>
                </Modal.Section>
                </Modal>
            </Page>
        </React.Fragment>
    )
}

export default Index