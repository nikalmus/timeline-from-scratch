import React, { useState } from "react";
import Leaf from "./Leaf";
import { getChildren, piTypes } from "../../api/wsapi";
import { useQuery } from "react-query";

const Branch = ({ item, level }) => {
  const [selected, setSelected] = useState(false);

  const hasChildren =
    item.DirectChildrenCount > 0 && item._type !== "PortfolioItem/Feature";
  const piType = piTypes[item._type];

  const { data, error, isLoading, isFetching, isError } = useQuery(
    [piType, item],
    () => getChildren(piType, item._ref)
  );

  const renderBranches = () => {
    if (hasChildren) {
      const nextLevel = level + 1;

      return data.map((item) => {
        return <Branch key={item.ObjectID} item={item} level={nextLevel} />;
      });
    }
    return null;
  };

  const toggleSelected = () => {
    setSelected((prev) => !prev);
  };

  return (
    <>
      <Leaf
        item={item}
        hasChildren={hasChildren}
        level={level}
        onSelected={toggleSelected}
        selected={selected}
      />
      {selected && renderBranches()}
    </>
  );
};

export default Branch;