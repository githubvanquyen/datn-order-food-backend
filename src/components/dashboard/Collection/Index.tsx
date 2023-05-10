import { Button, DataTable, LegacyCard, Modal, Page, Pagination, TextContainer, Thumbnail } from "@shopify/polaris";
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

interface Collection {
    id: number,
    name: string,
    image: string
    products: Product[],
}

interface CollectionRes {
    data: {
        success: boolean,
        data: Collection[],
        message: string,
    }
}

const Index = () => {
    const [active, setActive] = useState(false);
    const [activeDelete, setActiveDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(0);
    const dataTable = useRef<any[][]>([[]]);
    const [collection, setCollection] = useState<Collection[] | []>([])
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const handleChangeDelete = useCallback(() => setActiveDelete(!activeDelete), [activeDelete]);
    const PRODUCT_PAGE =  5
    const [deleteStatus, setDeleteStatus] = useState(false);


    const handleDeleteCollection = useCallback(async() =>{
        const deteleFls = await axios.post("http://localhost:4000/api/collection/delete", {
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

    const handleAddNewCollection = useCallback(() =>{
        navigate("/collection/create")
    },[])

    useEffect(() =>{
        const fetchSale =  async () => {
            const response = await axios.get<any, CollectionRes>("http://localhost:4000/api/collection/get-all-collection");
            if(response.data.success) {
                setCollection(response.data.data);
                dataTable.current =  response.data.data.map((item)  => ([
                    ...Object.values({
                        id: "#"+item.id,
                        name: item.name,
                        image: <Thumbnail source={item.image} size="medium" alt={`anh ${item.name}`}/>,
                        products: item.products !== null ? item.products.length : 0,
                    }),
                    <>
                      <span style={{ marginRight: '8px' }}>
                        <Button onClick={() =>{ navigate(`/collection/${item.id}`)}}>Sửa</Button> 
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
            <Page primaryAction={<Button primary onClick={handleAddNewCollection}>Thêm mới danh mục sản phẩm</Button>}>
                <LegacyCard>
                <LegacyCard.Section>
                    <DataTable
                        columnContentTypes={[
                            "text",
                            "text",
                            "text",
                            "text",
                            "text"
                        ]}
                        headings={[
                            "Mã",
                            "Tên danh mục sản phẩm",
                            "Ảnh",
                            "Số sản phẩm",
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
                    title="Xóa danh mục sản phẩm"
                    primaryAction={{
                        content: 'Xóa',
                        onAction: handleDeleteCollection,
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
                        Bạn có chắc muốn xóa danh mục sản phẩm 
                    </p>
                    </TextContainer>
                </Modal.Section>
                </Modal>
            </Page>
        </React.Fragment>
    )
}

export default Index