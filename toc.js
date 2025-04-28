// Populate the sidebar
//
// This is a script, and not included directly in the page, to control the total size of the book.
// The TOC contains an entry for each page, so if each page includes a copy of the TOC,
// the total size of the page becomes O(n**2).
class MDBookSidebarScrollbox extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this.innerHTML = '<ol class="chapter"><li class="chapter-item affix "><a href="index.html">首页</a></li><li class="chapter-item affix "><li class="spacer"></li><li class="chapter-item affix "><li class="part-title">目录</li><li class="chapter-item "><a href="chapters/01/index.html"><strong aria-hidden="true">1.</strong> 研究动机</a></li><li class="chapter-item "><a href="chapters/02/index.html"><strong aria-hidden="true">2.</strong> 随机过程</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="chapters/02/2_1_probability_spaces.html"><strong aria-hidden="true">2.1.</strong> 概率空间与随机变量</a></li><li class="chapter-item "><a href="chapters/02/2_2_stochastic_processes.html"><strong aria-hidden="true">2.2.</strong> 随机过程</a></li><li class="chapter-item "><a href="chapters/02/2_3_adapted_processes.html"><strong aria-hidden="true">2.3.</strong> 自适应过程</a></li><li class="chapter-item "><a href="chapters/02/2_4_wiener_process.html"><strong aria-hidden="true">2.4.</strong> Wiener 过程</a></li><li class="chapter-item "><a href="chapters/02/2_5_wiener_white_noise.html"><strong aria-hidden="true">2.5.</strong> Wiener 过程与白噪声的关系</a></li><li class="chapter-item "><a href="chapters/02/2_6_importance_of_wiener.html"><strong aria-hidden="true">2.6.</strong> Wiener 过程的重要性</a></li></ol></li><li class="chapter-item "><a href="chapters/03/index.html"><strong aria-hidden="true">3.</strong> 随机微积分</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="chapters/03/3_1_stochastic_integrals.html"><strong aria-hidden="true">3.1.</strong> 布朗运动下的随机积分</a></li><li class="chapter-item "><a href="chapters/03/3_2_ito_process_integral.html"><strong aria-hidden="true">3.2.</strong> Itô 过程与积分</a></li><li class="chapter-item "><a href="chapters/03/3_3_ito_lemma.html"><strong aria-hidden="true">3.3.</strong> Itô 引理</a></li><li class="chapter-item "><a href="chapters/03/3_4_sde.html"><strong aria-hidden="true">3.4.</strong> 随机微分方程</a></li></ol></li><li class="chapter-item "><a href="chapters/04/index.html"><strong aria-hidden="true">4.</strong> 随机微积分的应用</a><a class="toggle"><div>❱</div></a></li><li><ol class="section"><li class="chapter-item "><a href="chapters/04/4_1_black_scholes.html"><strong aria-hidden="true">4.1.</strong> Black-Scholes-Merton 期权定价模型</a></li><li class="chapter-item "><a href="chapters/04/4_2_langevin.html"><strong aria-hidden="true">4.2.</strong> Langevin 方程</a></li></ol></li><li class="chapter-item "><a href="chapters/05/index.html"><strong aria-hidden="true">5.</strong> 总结</a></li><li class="chapter-item affix "><li class="spacer"></li><li class="chapter-item affix "><a href="chapters/06/index.html">参考文献</a></li><li class="chapter-item affix "><a href="chapters/07_appendix_bernoulli.html">附录 A：Bernoulli 过程的事件空间与概率测度</a></li></ol>';
        // Set the current, active page, and reveal it if it's hidden
        let current_page = document.location.href.toString().split("#")[0];
        if (current_page.endsWith("/")) {
            current_page += "index.html";
        }
        var links = Array.prototype.slice.call(this.querySelectorAll("a"));
        var l = links.length;
        for (var i = 0; i < l; ++i) {
            var link = links[i];
            var href = link.getAttribute("href");
            if (href && !href.startsWith("#") && !/^(?:[a-z+]+:)?\/\//.test(href)) {
                link.href = path_to_root + href;
            }
            // The "index" page is supposed to alias the first chapter in the book.
            if (link.href === current_page || (i === 0 && path_to_root === "" && current_page.endsWith("/index.html"))) {
                link.classList.add("active");
                var parent = link.parentElement;
                if (parent && parent.classList.contains("chapter-item")) {
                    parent.classList.add("expanded");
                }
                while (parent) {
                    if (parent.tagName === "LI" && parent.previousElementSibling) {
                        if (parent.previousElementSibling.classList.contains("chapter-item")) {
                            parent.previousElementSibling.classList.add("expanded");
                        }
                    }
                    parent = parent.parentElement;
                }
            }
        }
        // Track and set sidebar scroll position
        this.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                sessionStorage.setItem('sidebar-scroll', this.scrollTop);
            }
        }, { passive: true });
        var sidebarScrollTop = sessionStorage.getItem('sidebar-scroll');
        sessionStorage.removeItem('sidebar-scroll');
        if (sidebarScrollTop) {
            // preserve sidebar scroll position when navigating via links within sidebar
            this.scrollTop = sidebarScrollTop;
        } else {
            // scroll sidebar to current active section when navigating via "next/previous chapter" buttons
            var activeSection = document.querySelector('#sidebar .active');
            if (activeSection) {
                activeSection.scrollIntoView({ block: 'center' });
            }
        }
        // Toggle buttons
        var sidebarAnchorToggles = document.querySelectorAll('#sidebar a.toggle');
        function toggleSection(ev) {
            ev.currentTarget.parentElement.classList.toggle('expanded');
        }
        Array.from(sidebarAnchorToggles).forEach(function (el) {
            el.addEventListener('click', toggleSection);
        });
    }
}
window.customElements.define("mdbook-sidebar-scrollbox", MDBookSidebarScrollbox);
