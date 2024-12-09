import { useNavigate } from "react-router-dom";

const Services = () => {
  const navigate = useNavigate();
  return (
    <>
      <div style={{ height: "40px" }}></div>
      <section id="services" className="services section-bg">
        <div className="container" data-aos="fade-up">
          <div className="section-title">
            <h2>Services</h2>
            <p>
              Magnam dolores commodi suscipit. Necessitatibus eius consequatur
              ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam
              quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea.
              Quia fugiat sit in iste officiis commodi quidem hic quas.
            </p>
          </div>

          <div className="row">
            <div
              className="col-xl-3 col-md-6 d-flex align-items-stretch"
              data-aos="zoom-in"
              data-aos-delay="100"
            >
              <div className="icon-box">
                <div className="icon">
                  <i className="bx bxl-dribbble"></i>
                </div>
                <h4>
                  <a
                    onClick={() => {
                      navigate("/emplist");
                    }}
                  >
                    Employee
                  </a>
                </h4>
                <p>
                  Detailed view of a selected employee, showing all the
                  information like personal details, department, role, etc.
                </p>
              </div>
            </div>

            <div
              className="col-xl-3 col-md-6 d-flex align-items-stretch mt-4 mt-md-0"
              data-aos="zoom-in"
              data-aos-delay="200"
            >
              <div className="icon-box">
                <div className="icon">
                  <i className="bx bx-file"></i>
                </div>
                <h4>
                  <a
                    onClick={() => {
                      navigate("/requested-documents");
                    }}
                  >
                    Document
                  </a>
                </h4>
                <p>
                  This component displays a table with the list of departments
                  and buttons for adding, editing, and deleting departments.
                </p>
              </div>
            </div>

            <div
              className="col-xl-3 col-md-6 d-flex align-items-stretch mt-4 mt-xl-0"
              data-aos="zoom-in"
              data-aos-delay="300"
            >
              <div className="icon-box">
                <div className="icon">
                  <i className="bx bx-tachometer"></i>
                </div>
                <h4>
                  <a
                    onClick={() => {
                      navigate("/attendance-calendar");
                    }}
                  >
                    Attendance & Leave Management
                  </a>
                </h4>
                <p>
                  Calendar view for employee attendance, Leave application form
                  and leave history view.
                </p>
              </div>
            </div>

            {/* <div
              className="col-xl-3 col-md-6 d-flex align-items-stretch mt-4 mt-xl-0"
              data-aos="zoom-in"
              data-aos-delay="400"
            >
              <div className="icon-box">
                <div className="icon">
                  <i className="bx bx-layer"></i>
                </div>
                <h4>
                  <a href="">Nemo Enim</a>
                </h4>
                <p>
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui
                  blanditiis
                </p>
              </div>
            </div> */}
          </div>
        </div>
      </section>
      <div style={{ height: "20px" }}></div>
    </>
  );
};
export default Services;
