window.mml = {
  config: {
    customBtns: [
      {
        enabled: true,
        label: 'ランダム文字列に置換する',
        handler: (() => {
          'use strict';

          const html = document.documentElement;
          const state = {
            isPressed: false,
          };
          const labels = [
            'ランダム文字列に置換する',
            'ランダム文字列を元に戻す',
          ];
          const sentence = [
            'あなたは結果もうそういう尊重屋というのの時がなっでう。',
            'あたかも時分に附着家はいよいよその煩悶ますんかもにしからいるますをも入会しですたて、実際にはしたたでない。',
            '勇気に向っまい方はむくむく時間がもっともななです。',
            'すでに張さんより観念奥突然講演を聞いませ自分その人格私か病気がという不危くたないますでと、その当時はそれか壁女がなりて、嘉納君の事で坊ちゃんの私をとうてい皆留学と命じてそこ別にご誤解に信ずるように常にご解釈を云えあるましで、何しろ何だか説明をなりでがいけたものになるますん。',
            'そうしてしかし肝教師を耽り事はそう空虚としないが、そのちりにはおくたがという叫び声をなっとありうな。',
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi eos quaerat vero adipisci cum quibusdam necessitatibus molestias voluptatum dolorem, porro perferendis ullam accusantium harum, quisquam inventore repellat optio, pariatur expedita!',
          ];
          const entries = [];
          const style = document.createElement('style');

          style.textContent = 'html[data-mlcmodulecontrolbtn-randomtext="true"] mml-snippet[ignore-randomtext=""] {position: relative;}html[data-mlcmodulecontrolbtn-randomtext="true"] mml-snippet[ignore-randomtext=""] > * {opacity: .3;}html[data-mlcmodulecontrolbtn-randomtext="true"] mml-snippet[ignore-randomtext=""]::before {color: #fff;background: #d73336;position: absolute;z-index: 1;top: 50%;left: 50%;padding: 5px;content: "\\30E9\\30F3\\30C0\\30E0\\6587\\5B57\\5217\\7F6E\\63DB\\6A5F\\80FD\\5BFE\\8C61\\5916\\306E\\30E2\\30B8\\30E5\\30FC\\30EB\\3067\\3059"; /* ランダム文字列置換機能対象外のモジュールです */transform: translate(-50%, -50%);}';
          document.head.appendChild(style);

          /**
          * @this {HTMLButtonElement}
          */
          const handler = function () {
            if (state.isPressed) {
              for (const [node, defaultText] of entries) {
                node.textContent = defaultText;
              }

              state.isPressed = false;
              this.innerText = labels[0];
              this.setAttribute('aria-pressed', 'false');
              html.dataset.mlcmodulecontrolbtnRandomtext = 'false';

              return;
            }

            state.isPressed = true;
            entries.length = 0;
            this.innerText = labels[1];
            this.setAttribute('aria-pressed', 'true');
            html.dataset.mlcmodulecontrolbtnRandomtext = 'true';

            for (const sample of document.querySelectorAll('mml-snippet:not([ignore-randomtext=""])')) {
              const nodelist = sample.querySelectorAll('*');
              const ignoreSelector = sample.getAttribute('ignore-randomtext');
              const ignoreList = ignoreSelector ? [...sample.querySelectorAll(ignoreSelector)] : [];

              for (const elementNode of nodelist) {
                if (ignoreSelector) {
                  if (ignoreList.includes(elementNode)) {
                    continue;
                  }
                }

                for (const node of [...elementNode.childNodes]) {
                  if (
                    node.nodeType !== Node.TEXT_NODE ||
                    (
                      node.textContent &&
                      node.textContent.trim() === ''
                    )
                  ) {
                    continue;
                  }

                  entries.push([node, node.textContent]);
                  node.textContent = sentence[Math.round(Math.random() * (sentence.length - 1))];
                }
              }
            }
          };

          return handler;
        })(),
      },
    ],
  },
};
