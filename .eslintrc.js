module.exports = {
    extends: [
        "react-app",
        "react-app/jest",
        "plugin:react-hooks/recommended"
    ],
    rules: {
        indent: ["warn", 4],
        "react/jsx-indent": ["warn", 4],
        "react/jsx-indent-props": ["warn", 4],
        quotes: [0, "double", { avoidEscape: true }],
        "quote-props": ["error", "as-needed"],
        "jsx-quotes": [2, "prefer-double"],
        "no-undef": 2,
        "id-length": 0,
        "max-len": 0,
        "brace-style": [
            1,
            "stroustrup",
            { allowSingleLine: true, },
        ],
        curly: 2,
        "no-use-before-define": [
            1,
            "nofunc",
        ],
        "no-unused-vars": [
            1,
            {
                args: "none",
                ignoreRestSiblings: true,
            },
        ],
        "arrow-body-style": 0,
        "no-unused-expressions": [
            2,
            { allowShortCircuit: true, },
        ],
        "object-curly-spacing": ["warn", "always", { objectsInObjects:true }],
        "object-curly-newline": ["warn", { multiline: true }],
        "prefer-const": "warn",
        "no-restricted-syntax": [
            1,
            "WithStatement",
            "DebuggerStatement",
        ],
        "no-underscore-dangle": 0,
        "react/jsx-boolean-value": 0,
        "react/jsx-first-prop-new-line": 0,
        "react/jsx-no-bind": 0,
        "react/no-did-mount-set-state": 0,
        "react/prefer-stateless-function": 0,
        "react/jsx-one-expression-per-line": [0],
        // Allow jsx tags inside .js files.
        "react/jsx-filename-extension": [1, { extensions: [".js", ".jsx"] }],
        // Disable props spreading (<App {...props} />) warning.
        "react/jsx-props-no-spreading": 0,
        // Throw warning instead of error when using array index as a key.
        "react/no-array-index-key": 1,
        // Allow using (props) => <Component /> and ({propName}) => <Component /> syntax.
        "react/destructuring-assignment": "off",
        // Disable <Fragment> => <> replacement. Feel free to change
        "react/jsx-fragments": "off",
        // Allow modules with named exports only.
        "import/prefer-default-export": 0,
        // Throw warning when <a href="#"> or <a href="javascript:void(0)"> are used. Use <button> instead.
        "jsx-a11y/anchor-is-valid": ["off", { aspects: ["invalidHref"] }],
    },
    // DeprecationWarning: The 'ecmaFeatures' config file property is deprecated and has no effect. (found in ".eslintrc.js")
    // ecmaFeatures: {
    //     jsx: true,
    //     modules: true,
    // },
    parser: "@babel/eslint-parser",
};
