# Modern C++ Best Practices in 2026

C++ has evolved dramatically over the past decade. Let's explore the best practices for writing clean, efficient, and maintainable modern C++ code.

## Use Modern Language Features

### Auto Type Deduction

Use `auto` to let the compiler deduce types:

```cpp
// ❌ Old way
std::map<std::string, std::vector<int>>::iterator it = myMap.begin();

// ✅ Modern way
auto it = myMap.begin();

// Also great for complex types
auto lambda = [](const auto& x) { return x * 2; };
```

### Structured Bindings (C++17)

Destructure tuples and pairs elegantly:

```cpp
std::map<std::string, int> scores = {{"Alice", 95}, {"Bob", 87}};

// ❌ Old way
for (const auto& pair : scores) {
    const auto& name = pair.first;
    const auto& score = pair.second;
    std::cout << name << ": " << score << '\n';
}

// ✅ Modern way
for (const auto& [name, score] : scores) {
    std::cout << name << ": " << score << '\n';
}
```

### Range-Based For Loops

Simplify iterations:

```cpp
std::vector<int> numbers = {1, 2, 3, 4, 5};

// ✅ Clean and readable
for (const auto& num : numbers) {
    std::cout << num << ' ';
}
```

## Smart Pointers Over Raw Pointers

### Use unique_ptr for Ownership

```cpp
// ✅ Automatic memory management
auto resource = std::make_unique<Resource>();

// Ownership transfer
auto resource2 = std::move(resource); // resource is now nullptr

// ❌ Avoid raw pointers for ownership
Resource* raw = new Resource(); // Manual delete required!
delete raw;
```

### Use shared_ptr for Shared Ownership

```cpp
std::shared_ptr<Data> data = std::make_shared<Data>();

// Multiple owners
auto data2 = data; // Reference count: 2
auto data3 = data; // Reference count: 3

// Automatically deleted when last owner goes out of scope
```

### Prefer make_unique and make_shared

```cpp
// ✅ Exception safe and efficient
auto ptr = std::make_unique<Widget>(arg1, arg2);
auto shared = std::make_shared<Widget>(arg1, arg2);

// ❌ Less efficient, potential exception safety issues
auto ptr2 = std::unique_ptr<Widget>(new Widget(arg1, arg2));
```

## Embrace Value Semantics

### Return by Value (NRVO)

The compiler optimizes this:

```cpp
std::vector<int> createVector() {
    std::vector<int> result;
    // ... populate result
    return result; // No copy! Compiler optimizes
}

// ✅ Clean usage
auto vec = createVector();
```

### Use std::optional for Optional Values

```cpp
// ✅ Explicit optional return
std::optional<User> findUser(int id) {
    if (/* found */) {
        return User{...};
    }
    return std::nullopt;
}

// Usage
if (auto user = findUser(42)) {
    std::cout << user->name << '\n';
} else {
    std::cout << "User not found\n";
}
```

## Const Correctness

### Mark Everything Const That Can Be

```cpp
class Vector3D {
    double x_, y_, z_;

public:
    // ✅ Const member functions
    double length() const {
        return std::sqrt(x_ * x_ + y_ * y_ + z_ * z_);
    }
    
    // ✅ Const parameters
    void normalize(const Vector3D& other) {
        // ...
    }
    
    // ✅ Const local variables
    void process() const {
        const auto len = length();
        // ...
    }
};

// ✅ Const references for read-only access
void print(const std::string& str) {
    std::cout << str << '\n';
}
```

## Use Standard Algorithms

### Prefer Algorithms Over Loops

```cpp
std::vector<int> numbers = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

// ❌ Manual loop
std::vector<int> evens;
for (const auto& n : numbers) {
    if (n % 2 == 0) {
        evens.push_back(n);
    }
}

// ✅ Using algorithm
std::vector<int> evens2;
std::copy_if(numbers.begin(), numbers.end(), 
             std::back_inserter(evens2),
             [](int n) { return n % 2 == 0; });

// ✅ Even better with ranges (C++20)
auto even_view = numbers | std::views::filter([](int n) { return n % 2 == 0; });
```

## Modern Error Handling

### Use Exceptions for Exceptional Cases

```cpp
// ✅ Use exceptions for errors
void processFile(const std::string& filename) {
    std::ifstream file(filename);
    if (!file) {
        throw std::runtime_error("Failed to open file: " + filename);
    }
    // ... process file
}

// Usage with RAII
try {
    processFile("data.txt");
} catch (const std::exception& e) {
    std::cerr << "Error: " << e.what() << '\n';
}
```

### Use std::expected for Expected Errors (C++23)

```cpp
// ✅ For expected errors
std::expected<int, std::string> parseInteger(const std::string& str) {
    try {
        return std::stoi(str);
    } catch (...) {
        return std::unexpected("Invalid integer format");
    }
}

// Usage
auto result = parseInteger("123");
if (result) {
    std::cout << "Value: " << *result << '\n';
} else {
    std::cout << "Error: " << result.error() << '\n';
}
```

## Use Concepts (C++20)

### Constrain Template Parameters

```cpp
// ✅ Clear requirements
template<typename T>
concept Numeric = std::is_arithmetic_v<T>;

template<Numeric T>
T add(T a, T b) {
    return a + b;
}

// ✅ More complex concepts
template<typename T>
concept Container = requires(T t) {
    { t.begin() } -> std::same_as<typename T::iterator>;
    { t.end() } -> std::same_as<typename T::iterator>;
    { t.size() } -> std::convertible_to<std::size_t>;
};

template<Container C>
void processContainer(const C& container) {
    // ...
}
```

## Avoid Common Pitfalls

### Don't Use Raw Arrays

```cpp
// ❌ C-style array
int arr[10];

// ✅ Use std::array or std::vector
std::array<int, 10> arr1;
std::vector<int> arr2;
```

### Avoid NULL and C-style Casts

```cpp
// ❌ Old style
int* ptr = NULL;
double d = (double)someInt;

// ✅ Modern style
int* ptr = nullptr;
auto d = static_cast<double>(someInt);
```

### Don't Use Manual Memory Management

```cpp
// ❌ Manual new/delete
Widget* w = new Widget();
// ... use w
delete w;

// ✅ RAII with smart pointers
auto w = std::make_unique<Widget>();
// Automatically deleted
```

## Performance Best Practices

### Reserve Capacity for Vectors

```cpp
// ✅ Avoid reallocations
std::vector<int> numbers;
numbers.reserve(1000);
for (int i = 0; i < 1000; ++i) {
    numbers.push_back(i);
}
```

### Use Move Semantics

```cpp
// ✅ Move instead of copy
std::vector<std::string> large_data = getLargeData();
processData(std::move(large_data)); // large_data is now empty
```

### Prefer emplace over push

```cpp
std::vector<std::pair<int, std::string>> vec;

// ❌ Creates temporary then copies
vec.push_back(std::make_pair(1, "hello"));

// ✅ Constructs in place
vec.emplace_back(1, "hello");
```

## Code Organization

### Use Namespaces

```cpp
namespace myapp::utils {
    void helperFunction() {
        // ...
    }
}

// Usage
myapp::utils::helperFunction();
```

### Use Inline Namespaces for Versioning

```cpp
namespace mylib {
    inline namespace v2 {
        void newFunction() { }
    }
    
    namespace v1 {
        void oldFunction() { }
    }
}

// mylib::newFunction() - default to v2
// mylib::v1::oldFunction() - explicit v1
```

## Testing and Documentation

### Write Testable Code

```cpp
// ✅ Dependency injection for testability
class DataProcessor {
    IDatabase& db_;
    
public:
    explicit DataProcessor(IDatabase& db) : db_(db) {}
    
    void process() {
        auto data = db_.fetch();
        // ... process data
    }
};

// Easy to mock in tests
```

### Use Doxygen Comments

```cpp
/**
 * @brief Calculates the factorial of a number
 * 
 * @param n The input number (must be non-negative)
 * @return The factorial of n
 * @throws std::invalid_argument if n is negative
 */
constexpr long long factorial(int n) {
    if (n < 0) throw std::invalid_argument("n must be non-negative");
    return n <= 1 ? 1 : n * factorial(n - 1);
}
```

## Build Systems and Tools

### Use CMake

```cmake
cmake_minimum_required(VERSION 3.20)
project(MyProject CXX)

set(CMAKE_CXX_STANDARD 23)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(myapp
    src/main.cpp
    src/utils.cpp
)

target_include_directories(myapp PRIVATE include)
```

### Enable Warnings and Static Analysis

```cmake
if(MSVC)
    target_compile_options(myapp PRIVATE /W4 /WX)
else()
    target_compile_options(myapp PRIVATE 
        -Wall -Wextra -Wpedantic -Werror
    )
endif()
```

## Summary Checklist

- ✅ Use `auto`, structured bindings, and range-based for loops
- ✅ Prefer smart pointers over raw pointers
- ✅ Return by value, use NRVO
- ✅ Mark everything `const` that can be
- ✅ Use standard algorithms and ranges
- ✅ Use concepts to constrain templates
- ✅ Avoid raw arrays, NULL, and C-style casts
- ✅ Use RAII for all resource management
- ✅ Write testable, well-documented code
- ✅ Use modern build tools and enable warnings

Modern C++ is powerful, expressive, and safe when used correctly. Follow these best practices to write code that is both efficient and maintainable.

## Resources

- [C++ Core Guidelines](https://isocpp.github.io/CppCoreGuidelines/)
- [cppreference.com](https://en.cppreference.com/)
- [Effective Modern C++ by Scott Meyers](https://www.oreilly.com/library/view/effective-modern-c/9781491908419/)
