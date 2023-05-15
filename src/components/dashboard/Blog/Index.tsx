import { Button, DataTable, LegacyCard, Modal, Page, Pagination, TextContainer, Thumbnail } from "@shopify/polaris";
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import dateFormat from "../../../utils/dateFormat";

interface Blog {
    id: number,
    title: string,
    content: string,
    createdAt: string,
    image: string
}

interface blogRes {
    data: {
        success: boolean,
        data: Blog[],
        message: string,
    }
}

const Index = () => {
    const [active, setActive] = useState(false);
    const [activeDelete, setActiveDelete] = useState(false);
    const [deleteId, setDeleteId] = useState(0);
    const dataTable = useRef<any[][]>([[]]);
    const [blog, setBlog] = useState<Blog[] | []>([])
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const handleChangeDelete = useCallback(() => setActiveDelete(!activeDelete), [activeDelete]);
    const PRODUCT_PAGE =  5
    const [deleteStatus, setDeleteStatus] = useState(false);


    const handleDeleteBlog = useCallback(async() =>{
        const deteleFls = await axios.post("http://localhost:4000/api/blog/delete", {
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

    const handleAddNewBlog = useCallback(() =>{
        navigate("/blog/create")
    },[])

    useEffect(() =>{
        const fetchSale =  async () => {
            const response = await axios.get<any, blogRes>("http://localhost:4000/api/blog/get-all-blog");
            if(response.data.success) {
                setBlog(response.data.data);
                dataTable.current =  response.data.data.map((item)  => ([
                    ...Object.values({
                        id: "#"+item.id,
                        title: item.title,
                        image: <Thumbnail source={item.image} size="medium" alt={`anh ${item.title}`}/>,
                        createdAt: dateFormat(item.createdAt),
                    }),
                    <>
                      <span style={{ marginRight: '8px' }}>
                        <Button onClick={() =>{ navigate(`/blog/${item.id}`)}}>Sửa</Button> 
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
            <Page primaryAction={<Button primary onClick={handleAddNewBlog}>Thêm mới bài viết</Button>}>
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
                            "Tên bài viết",
                            "Ảnh",
                            "Ngày tạo",
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
                    title="Xóa bài viết"
                    primaryAction={{
                        content: 'Xóa',
                        onAction: handleDeleteBlog,
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
                        Bạn có chắc muốn xóa bài viết này
                    </p>
                    </TextContainer>
                </Modal.Section>
                </Modal>
            </Page>
        </React.Fragment>
    )
}

export default Index