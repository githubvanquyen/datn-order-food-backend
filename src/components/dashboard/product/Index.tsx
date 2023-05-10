import { 
  Page, 
  LegacyCard, 
  DataTable, 
  Button, 
  Thumbnail, 
  Modal,
  Pagination,
  ChoiceList,
  Filters,
  TextContainer,
  RangeSlider,
} from "@shopify/polaris";
import React, {useEffect, useState, useCallback, useRef, useMemo} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import priceFormat from "../../../utils/priceFormat";

const Index = () => {
    const navigate = useNavigate()
    const rowsData = useRef([]);
    const [rowPerPage, setRowPerPage] = useState([]);
    const [active, setActive] = useState(false);
    const [deleteId, setDeleteId] = useState(0);
    const [deleteStatus, setDeleteStatus] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [collections, setCollections] = useState([]);
    const PRODUCT_PAGE = useRef(5);
    const [property, setProperty] = useState<string[]>([]);
    const [collectionType, setCollectionType] = useState<string[]>([]);
    const [moneySpent, setMoneySpent] = useState<[number, number] | undefined>(
      undefined,
    );
    const [queryValue, setQueryValue] = useState('');
    
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
        rowsData.current = response.data.data.map((item: any)  => ([
          ...Object.values({
            id: item.id,
            name: item.name,
            image: item.image,
            description: item.description,
            regularPrice: item.regularPrice,
            salePrice: item.salePrice,
            collection: item.collection.name,
          }),
          <>
            <span style={{ marginRight: '8px' }}>
              <Button onClick={() =>{ navigate(`/product/${item.id}`)}}>Sửa</Button> 
            </span>
            <Button onClick={() =>{setDeleteId(item.id);handleChange()}}>Xóa</Button>
          </>
        ]))
        setCurrentPage(1);
        setTotalPage(Math.ceil(response.data.data.length / Number(PRODUCT_PAGE.current)));
      }
      fetchData().then()
    }, [deleteStatus, collectionType])

    useEffect(() =>{
      const fetchCollection =  async() =>{
        const response = await axios.get("http://localhost:4000/api/collection/get-all-collection");
        if(response.data.success){
          setCollections(response.data.data);
        }
      }
      fetchCollection().then()
    },[])
    
    const handleChangeRoute = () =>{
      navigate("/product/create")
    }

  const handlePropertyChange = useCallback(
    (value: string[]) => setProperty(value),
    [],
  );
  const handleCollectionTypeChange = useCallback(
    (value: string[]) => setCollectionType(value),
    [],
  );
  const handleMoneySpentChange = useCallback(
    (value: [number, number]) => setMoneySpent(value),
    [],
  );
  const handleFiltersQueryChange = useCallback(
    (value: string) => setQueryValue(value),
    [],
  );
  const handlePropertyRemove = useCallback(() => setProperty([]), []);
  const handleCollectionTypeRemove = useCallback(() => setCollectionType([]), []);
  const handleMoneySpentRemove = useCallback(() => setMoneySpent(undefined),[],);
  const handleQueryValueRemove = useCallback(() => setQueryValue(''), []);
  const handleFiltersClearAll = useCallback(() => {
    handlePropertyRemove();
    handleCollectionTypeRemove();
    handleMoneySpentRemove();
    handleQueryValueRemove();
  }, [
    handlePropertyRemove,
    handleQueryValueRemove,
    handleCollectionTypeRemove,
    handleMoneySpentRemove,
  ]);

  const filters = [
    {
      key: 'property',
      label: 'Thuộc tính',
      filter: (
        <ChoiceList
          title="Sắp xếp"
          titleHidden
          choices={[
            {label: 'id', value: 'id'},
            {label: 'Tên', value: 'Tên'},
            {label: 'Giá', value: 'Giá'},
          ]}
          selected={property || []}
          onChange={handlePropertyChange}
          
        />
      ),
      shortcut: true,
    },
    {
      key: 'collectionType',
      label: 'Danh mục sản phẩm',
      filter: (
        <ChoiceList
          title="Danh mục sản phẩm"
          titleHidden
          choices={collections.map((item:any) =>(
            {label: item.name, value: item.name}
          ))}
          selected={collectionType || []}
          onChange={handleCollectionTypeChange}
          allowMultiple
        />
      ),
      shortcut: true,
    },
    {
      key: 'moneySpent',
      label: 'Giá',
      filter: (
        <RangeSlider
          label="Giá trong khoảng"
          labelHidden
          value={moneySpent || [0, 100000]}
          prefix="vnd"
          output
          min={0}
          max={500000}
          step={10000}
          onChange={handleMoneySpentChange}
        />
      ),
    },
    
  ];

  const appliedFilters = [];
  if (!isEmpty(property)) {
    const key = 'property';
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, property),
      onRemove: handlePropertyRemove,
    });
  }
  if (!isEmpty(collectionType)) {
    const key = 'collectionType';
    appliedFilters.push({
      key,
      label: disambiguateLabel(key, collectionType),
      onRemove: handleCollectionTypeRemove,
    });
  }
  if (moneySpent) {
    appliedFilters.push({
      key: 'moneySpent',
      label: `Giá trong khoảng từ ${priceFormat.format(moneySpent[0])} đến ${priceFormat.format(moneySpent[1])}`,
      onRemove: handleMoneySpentRemove,
    });
  }
  
  useEffect(() =>{
    if(property.length > 0 ){
      if(property[0] === "id"){
        let sortedRow = rowsData.current.sort((a:any, b: any) =>(Number(b[0]) - Number(a[0])));
        rowsData.current = sortedRow
      }
      if(property[0] === "Tên"){
        let sortedRow =  rowsData.current.sort((a:any, b: any) => { return(a[1].localeCompare(b[1]))})
        rowsData.current = sortedRow
      }
      if(property[0] === "Giá"){
        let sortedRow = rowsData.current.sort((a:any, b: any) =>(Number(b[5]) - Number(a[5])));
        rowsData.current = sortedRow
      }
    }else{
      let sortedRow = rowsData.current.sort((a:any, b: any) =>(Number(a[0]) - Number(b[0])));
      rowsData.current = sortedRow;
    }

    if(collectionType.length > 0){
      let sortedRow = rowsData.current.filter(item => (collectionType.indexOf(item[6]) !== -1))
      setCurrentPage(1);
      sortedRow.length > Number(PRODUCT_PAGE) ? setTotalPage(Math.ceil(sortedRow.length / Number(PRODUCT_PAGE))) : setTotalPage(1);
      rowsData.current = sortedRow
    }

    if(moneySpent !== undefined){
      let sortedRow = rowsData.current.filter((item:any) => (item[4] > moneySpent[0] && item[4] < moneySpent[1]))
      setCurrentPage(1);
      sortedRow.length > Number(PRODUCT_PAGE) ? setTotalPage(Math.ceil(sortedRow.length / Number(PRODUCT_PAGE))) : setTotalPage(1);
      rowsData.current = sortedRow
    }

  },[property, collectionType, moneySpent])

  useEffect(() =>{  
    setRowPerPage(rowsData.current.slice((currentPage - 1) * Number(PRODUCT_PAGE.current), currentPage * Number(PRODUCT_PAGE.current)))
  },[deleteStatus, currentPage, property, collectionType, moneySpent])
  
  const newrow = rowPerPage.map((item: [string, string]) => {
    return item.map((itemI, index) =>{
      if (index === 2){
        return (<Thumbnail
          size="large"
          source={`${itemI}`}
          alt=""
        />)
      }else if(index === 0){
        return "#"+itemI
      }else if(index === 4 || index === 5){
        return priceFormat.format(Number(itemI)).toString()
      } else {
        return itemI
      }
    })
  })
    
    return (
      <React.Fragment>
        <Page primaryAction={<Button primary onClick={handleChangeRoute}>Thêm mới sản phẩm</Button>}>
            <LegacyCard>
              <LegacyCard.Section>
                <Filters
                  queryValue={queryValue}
                  queryPlaceholder="Tìm kiếm sản phẩm"
                  filters={filters}
                  appliedFilters={appliedFilters}
                  onQueryChange={handleFiltersQueryChange}
                  onQueryClear={handleQueryValueRemove}
                  onClearAll={handleFiltersClearAll}
                />
              </LegacyCard.Section>
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
                        "Tên sản phẩm",
                        "Ảnh sản phẩm",
                        "Mô tả",
                        "giá gốc",
                        "giá bán",
                        "Hành động"
                    ]}
                    rows={newrow.map(item => {item.splice(6,1); return item})}
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
    function disambiguateLabel(key: string, value: string[]): string {
      switch (key) {
        case 'property':
          return value.map((val) => `Sắp xếp theo ${val}`).join(', ');
        case 'collectionType':
          return value.join(', ');
        default:
          return value.toString();
      }
    }
  
    function isEmpty(value: string | string[]): boolean {
      if (Array.isArray(value)) {
        return value.length === 0;
      } else {
        return value === '' || value == null;
      }
    }
}
export default Index