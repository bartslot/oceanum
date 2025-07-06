import React, { useRef, useEffect, useState } from 'react';


const About = () => {

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto text-gray-800">
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">AI-Powered Lesson Builder for History Teachers</h1>
        <p className="text-lg">An innovative web-based tool integrating Google Scholar, storytelling, gamification, and flow-state principles to transform history education.</p>
      </header>

      <main className="space-y-10">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900" id="overview">Overview</h2>
          <p>This AI-assisted tool empowers history teachers to create interactive, research-based lessons. By combining scholarly data from <a className="text-blue-600 underline" href="https://scholar.google.com" target="_blank">Google Scholar</a>, narrative learning structures, gamified challenges, and flow-state psychology, the platform turns history education into a highly engaging and effective experience.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900" id="google-scholar-integration">Google Scholar Integration</h2>
          <h3 className="text-xl font-medium text-gray-800">Academic Accuracy Through AI</h3>
          <p>Our platform connects with Google Scholar to retrieve verified academic insights for lesson development. This ensures teachers create lessons rooted in evidence-based historical scholarship (<a className="text-blue-600 underline" href="#sources">AssignmentGPT, 2024</a>).</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900" id="history-focus">Why History First?</h2>
          <h3 className="text-xl font-medium text-gray-800">Rich in Stories, Ready for Innovation</h3>
          <p>History is the ideal starting point due to its natural alignment with storytelling. From gladiators to trade routes, it offers compelling content that benefits from AI-generated structure and context (<a className="text-blue-600 underline" href="#sources">Oceanum Project, 2025</a>).</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900" id="storytelling-framework">Storytelling Framework</h2>
          <h3 className="text-xl font-medium text-gray-800">Memory-Rich Narratives</h3>
          <p>Each lesson is crafted using a three-act structure or hero's journey model. This helps students relate to events and figures on a human level and improves retention (<a className="text-blue-600 underline" href="#sources">Monroe, 2014</a>).</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900" id="gamification-elements">Gamification Elements</h2>
          <h3 className="text-xl font-medium text-gray-800">Motivation Through Play</h3>
          <p>Incorporating points, badges, levels, and quests, the platform motivates students through achievements and interactive learning (<a className="text-blue-600 underline" href="#sources">SmartDev, 2024</a>).</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900" id="flow-design">Flow-State Learning</h2>
          <h3 className="text-xl font-medium text-gray-800">Keeping Students in the Zone</h3>
          <p>Dynamic difficulty adjustment and immediate feedback ensure students stay engaged without frustration or boredom, following Csikszentmihalyi’s principles of optimal experience (<a className="text-blue-600 underline" href="#sources">Ingenuiti, 2025</a>).</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900" id="interactive-delivery">Interactive Web Delivery</h2>
          <h3 className="text-xl font-medium text-gray-800">Simple, Seamless Classroom Access</h3>
          <p>Lessons are delivered via a browser with QR code or class-code access, mimicking tools like Google Classroom and ClassDojo (<a className="text-blue-600 underline" href="#sources">ClassDojo Help Center, 2021</a>).</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900" id="conclusion">Conclusion</h2>
          <p>This tool transforms lesson planning into a creative, AI-assisted experience. Teachers gain a research assistant, students receive interactive and meaningful lessons, and administrators get measurable engagement outcomes. The future of education is here.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900" id="sources">Sources (Harvard Style)</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>AssignmentGPT</strong> (2024). <em>14 Best AI Tools for Academic Research</em>. [online] Available at: <a className="text-blue-600 underline" href="https://assignmentgpt.com/tools-for-research" target="_blank">https://assignmentgpt.com/tools-for-research</a> [Accessed 1 Jul. 2025].</li>
            <li><strong>Monroe, J.</strong> (2014). <em>Maximizing Student Attention: Low-tech Effectiveness in Large Lecture Formats</em>. Iowa State University.</li>
            <li><strong>SmartDev</strong> (2024). <em>Guide to Gamification in EdTech: Key Elements, Successful Strategies & Top Examples</em>. [online] Available at: <a className="text-blue-600 underline" href="https://smartdevhub.com/gamification-guide" target="_blank">https://smartdevhub.com/gamification-guide</a> [Accessed 1 Jul. 2025].</li>
            <li><strong>Oceanum Project Code</strong> (2025). <em>About Section</em>. [online] Available at: <a className="text-blue-600 underline" href="https://oceanum.ai/about" target="_blank">https://oceanum.ai/about</a> [Accessed 1 Jul. 2025].</li>
            <li><strong>Ingenuiti</strong> (2025). <em>Level Up Your Learning: Frameworks for Gamified Learning</em>. [online] Available at: <a className="text-blue-600 underline" href="https://ingenuiti.com/learning-frameworks" target="_blank">https://ingenuiti.com/learning-frameworks</a> [Accessed 1 Jul. 2025].</li>
            <li><strong>ClassDojo Help Center</strong> (2021). <em>Student Login with a Class QR Code</em>. [online] Available at: <a className="text-blue-600 underline" href="https://classdojo.zendesk.com/hc/en-us/articles/200000000" target="_blank">https://classdojo.zendesk.com/hc/en-us/articles/200000000</a> [Accessed 1 Jul. 2025].</li>
          </ul>
        </section>
      </main>
    </div>
  );
};
export default About;