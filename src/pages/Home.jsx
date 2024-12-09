import React from "react";
import { useEffect, useState} from "react";

const Home = () => {
  const clientsList = [
    
    "assets/img/clients/client-10.png",
    "assets/img/clients/client-11.png",
    "assets/img/clients/client-12.png",
    "assets/img/clients/client-13.png",
    "assets/img/clients/client-14.png",
    "assets/img/clients/client-15.png",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleClients = clientsList.slice(currentIndex, currentIndex + 6);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        // If we've reached the end of the list, reset to 0, else move to the next index
        if (prevIndex + 6 >= clientsList.length) {
          return 0;
        }
        return prevIndex + 1;
      });
    }, 3000); // Change logos every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [clientsList.length]);

  return (
    <>
      <section id="hero" className="d-flex align-items-center">
        <div className="container">
          <div className="row">
            <div
              className="col-lg-6 d-flex flex-column justify-content-center pt-4 pt-lg-0 order-2 order-lg-1"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <h1>Choose Better Job For Your Career</h1>
              <h2>
              Welcome to teamMatch go-to destination for discovering top talent and exciting career opportunities. 
              We bridge the gap between employers seeking exceptional candidates and professionals eager to take their careers to the next level.
              </h2>
              <div className="d-flex justify-content-center justify-content-lg-start">
                 
              </div>
            </div>
            <div
              className="col-lg-6 order-1 order-lg-2 hero-img"
              data-aos="zoom-in"
              data-aos-delay="200"
            >
              <img
                src="assets/img/hero-img.png"
                className="img-fluid animated"
                alt=""
              />
            </div>
          </div>
        </div>
      </section>

      <main id="main">
      <section id="clients" className="clients section-bg">
      <div className="container client-container">
        <div
          className="client-row"
          style={{
            transform: `translateX(-${(currentIndex % clientsList.length) * 16.66}%)`,
          }}
        >
          {clientsList.map((client, index) => (
            <div
              key={index}
              className="col-lg-2 col-md-4 col-6 d-flex align-items-center justify-content-center client-logo"
            >
              <img
                src={client}
                className="img-fluid"
                alt={`Client ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>

        <section id="why-us" className="why-us section-bg">
          
        </section>

        <section id="faq" className="faq section-bg">
          <div className="container" data-aos="fade-up">
            <div className="section-title">
              <h2>Frequently Asked Questions</h2>
              <p>
                Magnam dolores commodi suscipit. Necessitatibus eius consequatur
                ex aliquid fuga eum quidem. Sit sint consectetur velit. Quisquam
                quos quisquam cupiditate. Et nemo qui impedit suscipit alias ea.
                Quia fugiat sit in iste officiis commodi quidem hic quas.
              </p>
            </div>

            <div className="faq-list">
              <ul>
                <li data-aos="fade-up" data-aos-delay="100">
                  <i className="bx bx-help-circle icon-help"></i>{" "}
                  <a
                    data-bs-toggle="collapse"
                    className="collapse"
                    data-bs-target="#faq-list-1"
                  >
                    What types of jobs are available on this platform?{" "}
                    <i className="bx bx-chevron-down icon-show"></i>
                    <i className="bx bx-chevron-up icon-close"></i>
                  </a>
                  <div
                    id="faq-list-1"
                    className="collapse show"
                    data-bs-parent=".faq-list"
                  >
                    <p>
                      Our platform offers a wide range of jobs, including
                      full-time, part-time, remote, freelance, and internships
                      across various industries like IT, healthcare, education,
                      marketing, and more.
                    </p>
                  </div>
                </li>

                <li data-aos="fade-up" data-aos-delay="200">
                  <i className="bx bx-help-circle icon-help"></i>{" "}
                  <a
                    data-bs-toggle="collapse"
                    data-bs-target="#faq-list-2"
                    className="collapsed"
                  >
                    How do I apply for a job?{" "}
                    <i className="bx bx-chevron-down icon-show"></i>
                    <i className="bx bx-chevron-up icon-close"></i>
                  </a>
                  <div
                    id="faq-list-2"
                    className="collapse"
                    data-bs-parent=".faq-list"
                  >
                    <p>
                      To apply for a job, first create an account, complete your
                      profile, and upload your resume. Then, browse through job
                      listings, click on the one you’re interested in, and
                      follow the instructions to submit your application.
                    </p>
                  </div>
                </li>

                <li data-aos="fade-up" data-aos-delay="300">
                  <i className="bx bx-help-circle icon-help"></i>{" "}
                  <a
                    data-bs-toggle="collapse"
                    data-bs-target="#faq-list-3"
                    className="collapsed"
                  >
                    Is there a fee to use the platform?{" "}
                    <i className="bx bx-chevron-down icon-show"></i>
                    <i className="bx bx-chevron-up icon-close"></i>
                  </a>
                  <div
                    id="faq-list-3"
                    className="collapse"
                    data-bs-parent=".faq-list"
                  >
                    <p>
                      No, our platform is free for job seekers. Employers may
                      pay for premium job postings or additional features, but
                      job seekers can browse, apply, and manage their job
                      applications without any cost.
                    </p>
                  </div>
                </li>

                <li data-aos="fade-up" data-aos-delay="400">
                  <i className="bx bx-help-circle icon-help"></i>{" "}
                  <a
                    data-bs-toggle="collapse"
                    data-bs-target="#faq-list-4"
                    className="collapsed"
                  >
                    How can I improve my chances of getting hired?
                    <i className="bx bx-chevron-down icon-show"></i>
                    <i className="bx bx-chevron-up icon-close"></i>
                  </a>
                  <div
                    id="faq-list-4"
                    className="collapse"
                    data-bs-parent=".faq-list"
                  >
                    <p>
                      To improve your chances, ensure your profile is complete
                      and up-to-date, tailor your resume and cover letter for
                      each job, and apply early. Use relevant keywords in your
                      profile that match the job descriptions you’re interested
                      in.
                    </p>
                  </div>
                </li>

                <li data-aos="fade-up" data-aos-delay="500">
                  <i className="bx bx-help-circle icon-help"></i>{" "}
                  <a
                    data-bs-toggle="collapse"
                    data-bs-target="#faq-list-5"
                    className="collapsed"
                  >
                    Can I apply for jobs outside of my location?{" "}
                    <i className="bx bx-chevron-down icon-show"></i>
                    <i className="bx bx-chevron-up icon-close"></i>
                  </a>
                  <div
                    id="faq-list-5"
                    className="collapse"
                    data-bs-parent=".faq-list"
                  >
                    <p>
                      Yes, many companies offer remote work options or are open
                      to hiring candidates from different locations. You can
                      filter jobs based on location or look specifically for
                      remote opportunities.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* {showPreloder  && <div id="preloader"></div>}
      {showBackToTop && (
        <a
          href="#"
          class="back-to-top d-flex align-items-center justify-content-center"
        >
          <i class="bi bi-arrow-up-short"></i>
        </a>
      )} */}
      <div style={{ height: "20px" }}>
      </div>
    </>
  );
};

export default Home;
