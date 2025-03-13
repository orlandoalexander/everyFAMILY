import React from "react";
import "./ResourceType.css";
import { AlignLeftOutlined, LinkOutlined, VideoCameraOutlined, CaretRightOutlined, FileTextOutlined } from "@ant-design/icons";
import { HeartOutlined, BookOutlined } from "@ant-design/icons";


function ResourceType({type}) {
    if (type === "article") {
        return (
            <div className="article-tag">
                <AlignLeftOutlined style={{fontSize: 14, marginRight: 5}}/>
                <span style={{fontSize: 10}}>Article</span>
            </div>
        )
    }
    else if (type === "video") {
        return (
            <div className="video-tag">
                <CaretRightOutlined style={{fontSize: 14, marginRight: 5}}/>
                <span style={{fontSize: 10}}>Video</span>
            </div>
        )
    }
    else return null;
}

export default ResourceType;