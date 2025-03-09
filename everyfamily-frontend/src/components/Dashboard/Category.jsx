import './Category.css';
import {Collapse, Flex, Row} from "antd";
import React from "react";
import ResourceCard from "./resourceCard.jsx";

function Category({categoryKey, label, children}) {
    const item = [
        {
            key: categoryKey,
            label: label,
            children:
                <Row gutter={16}>
                    <Flex>
                        {children}
                    </Flex>
                </Row>,
        }];
    const onChange = (key) => {
        console.log(key);
    }
    return (
        <Collapse items={item}  size="small" bordered={false} onChange={onChange} />
    )
}

export default Category;

