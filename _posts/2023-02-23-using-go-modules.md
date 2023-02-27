---
title: Using Go Modules
date: 2023-02-23 04:05:00 +0800
categories: [Notes, Golang]
tags: [Golang, Golang Modules]
---

Learning Material: [Using Go Modules](https://go.dev/blog/using-go-modules), [Semantic Import Versioning](https://research.swtch.com/vgo-import)

## Module and Package

A module can be seen as a pack of one or more go packages. Although we always `import` some go packages in our code, the module is the atmoic unit in go code distribution, which means you can't get from others a single go package without a `go.mod` file in its root directory (a go package with a `go.mod` in its root directory is also a module). 

## Creating a new module

Simply typing `go mod init $MODULE_PATH$` will generate a `go.mod` file and make the current working directory the root of a new module. The `go.mod` file should only appear in the root of the module, which means you don't need to run `go mod init` in the subdirectories of a module (Things can be different with multi-modules case, such as [semantic import versioning](https://research.swtch.com/vgo-import) with a good example, [quote](https://github.com/rsc/quote)). Packages in a subdirectory will have an import path consisting of the module path plus the path to the subdirectory.

## Adding a dependency

Just import in your code and run `go mod tidy`. It will automatically resolve direct and indirect dependencies and then add them to your `go.mod` file. This command also remove unused dependencies in `go.mod` to make sure `go.mod` matches the source code in the module. 

Go also maintains a `go.sum` file containing the expected hashes of specific module versions to ensure the integrity.

## Upgrading dependencies

See [this page](https://semver.org/) to learn about SemVer, `Major.Minor.Patch`, which is adopted by many modern languages including go.

### Upgrading to a new minor version

Just run `go get $PACKAGE_PATH$\[@$VERSION$ (default = latest)\]`. Notice that this could still cause problems of compatibility due to bugs of the package or incorrect assumptions in your code about module behaviour. If so, you can run `go list -m -versions $PACKAGE_NAME$` to see all the available tagged versions of the module and get a proper version.

### Adding a new major version

This is a completely different. You should learn about [semantic import versioning](https://research.swtch.com/vgo-import) first and see an example, [quote](https://github.com/rsc/quote).

To achieve this, you need to add an additional `import` of the new major version like below in your code.

```go
import {
    "$MODULE_PATH$/$RELATIVE_PACKAGE_PATH$"
    $PACKAGE_ALIAS$ "$MODULE_PATH$/v$MAJOR_VERSION$/$RELATIVE_PACKAGE_PATH$"
}
```

Go allows a build to include at most one version of any particular module path, meaning at most one of each major version. This makes go code more readable for both developers and tools. At the same time, go allows different major versions of a module. This enables developers to **incrementally** upgrading the dependencies in their code.

### Upgrading to a new major version

Replace the old `import` with the new version and update the deprecated API in your code.

## Removing unused dependencies

Just run `go mod tidy`.
