const About = () => {
  return (
    <>
    <div style={{ height: "40px" }}>
    </div>
      <section id="about" className="about">
        <div className="container" data-aos="fade-up">
          <div className="section-title">
            <h2>About Us</h2>
          </div>

          <div className="row content">
            <div className="col-lg-6">
              <p>
              Pain itself is very important to the world of work and the whole world, but it’s an exception to this rule.
              </p>
              <ul>
                <li>
                  <i className="ri-check-double-line"></i> Ullamco laboris nisi
                  ut aliquip ex ea commodo consequat
                </li>
                <li>
                  <i className="ri-check-double-line"></i> Duis aute irure dolor
                  in reprehenderit in voluptate velit
                </li>
                <li>
                  <i className="ri-check-double-line"></i> Ullamco laboris nisi
                  ut aliquip ex ea commodo consequat
                </li>
              </ul>
            </div>
            <div className="col-lg-6 pt-4 pt-lg-0">
              <p>
              At teamMatch, we are passionate about revolutionizing the job search process. Our platform is built to connect ambitious job seekers with dynamic employers, streamlining the path to meaningful employment. By leveraging advanced technology and industry insights, we offer tailored job matches and intuitive tools that make the search process efficient and effective. Our commitment is to empower individuals and organizations alike, providing personalized support and resources to achieve their career and hiring goals. Join us in redefining how talent meets opportunity and take the first step towards a brighter professional future.
              </p>
              <a href="#" className="btn-learn-more">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
