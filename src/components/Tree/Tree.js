import React, { useRef, useEffect, useState } from "react";

import { getAllItems } from "../../api/wsapi";
import { useQuery } from "react-query";
import Branch from "./Branch";
import "./Tree.css";

const Tree = ({ setBars }) => {
  const [clicked, setClicked] = useState(false);
  const [rerender, setRerender] = useState(false);
  const nodesRef = useRef();
  const handleClick = () => {
    console.log("IN HANDLE CLICK");
    setClicked((prev) => !prev);
  };
  const piType = "PortfolioItem/Theme";

  const { data, error, isLoading, isFetching, isError } = useQuery(
    [piType],
    () => getAllItems(piType, "2022-04-01", "2022-12-31")
  );

  const treeRef = useRef();

  const onRender = () => {
    var div = document.querySelector("#tree");
    var nodeIterator = document.createNodeIterator(div, NodeFilter.SHOW_TEXT);
    let temp = [];
    while (nodeIterator.nextNode()) {
      let node = nodeIterator.referenceNode.nodeValue.trim();
      if (!isLoading) {
        console.log(node);
        temp.push(node);
      }
    }
    nodesRef.current = temp;
    console.log(nodesRef.current);
    setBars(nodesRef.current);
  };

  useEffect(() => {
    onRender();
  }, [clicked, rerender]); //need rerender in the dependencies array

  useEffect(() => {
    console.log("this should run twice");
    setRerender(!rerender);
  }, [data]);

  return (
    <div id="tree" ref={treeRef}>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>Error!</p>
      ) : data ? (
        data.map((item) => (
          <Branch
            key={item.ObjectID}
            item={item}
            level={0}
            handleClick={handleClick}
          />
        ))
      ) : null}
    </div>
  );
};

export default Tree;
