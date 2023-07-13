import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { SubCategoryCard } from "./subCategory-card";
import { Col, Row } from "antd";

export const SubCategoryList = () => {
  const { category_id } = useParams();
  const subCategories = useSelector((state) => state.subCategories)
    .filter((subCategory) => (subCategory.category_id === category_id));

  return (
    <div className="subCategories-list-main-container mt-10">
      <div className="subCategories-list-inner-container">
        <div className="subCategories-list">
          <Row align={"stretch"} justify={'space-evenly'} gutter={[0, 15]}>
            {subCategories?.map((subCategory) => (
              <Col key={subCategory?._id}>
                <SubCategoryCard subCategory={subCategory} />
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
};